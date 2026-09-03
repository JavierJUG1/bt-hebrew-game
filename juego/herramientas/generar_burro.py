# -*- coding: utf-8 -*-
"""
Genera src/data/burro.js a partir de los SVG originales del burro.

Los siete SVG entregados son fotogramas ACUMULATIVOS del mismo dibujo, pero
cada uno se exportó con su propio viewBox. Cuatro de ellos comparten sistema
de coordenadas con PERDEDOR.svg; 'patas delanteras.svg' está desplazado
(-38.56, -18.44), medido comparando la caja de la estaca entre archivos.

Además, el pasto del asset lleva RECORTADAS las siluetas de las patas, así que
no puede usarse como capa base: en los estados sin patas se verían huecos
blancos. Por eso se dibuja un suelo neutro aparte y el pasto original solo
aparece en el estado final.

Uso:  python3 herramientas/generar_burro.py
"""
import re, json, colorsys, os, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(os.path.dirname(AQUI))   # carpeta ahorcado_burro
SALIDA = os.path.join(os.path.dirname(AQUI), 'src', 'data', 'burro.js')

VIEW_BOX = "0 0 1693.57 1476.4"
DESPLAZAMIENTO_PATAS_DELANTERAS = (-38.56, -18.44)

# Suelo neutro propio (ver explicación arriba).
SUELO = (
    '<ellipse cx="1108" cy="1358" rx="566" ry="112" fill="#dde5c8"/>'
    '<ellipse cx="1108" cy="1344" rx="520" ry="94" fill="#e9efd9"/>'
    '<ellipse cx="78" cy="1418" rx="92" ry="24" fill="#dde5c8"/>'
)


def buscar(nombre):
    for base in (RAIZ, os.path.join(RAIZ, 'Assets', 'piezas burro')):
        p = os.path.join(base, nombre)
        if os.path.exists(p):
            return p
    sys.exit('No encuentro el asset: ' + nombre)


def leer(nombre):
    s = open(buscar(nombre), encoding='utf-8').read()
    return re.sub(r'<metadata>.*?</metadata>', '', s, flags=re.S)


def interior(s):
    return re.search(r'<svg[^>]*>(.*)</svg>', s, re.S).group(1)


def con_prefijo(s, tag):
    """Aísla clases e ids del archivo para que 7 SVG convivan en una página."""
    b = interior(s)
    b = re.sub(r'\bcls-(\d+)\b', lambda m: '%s-c%s' % (tag, m.group(1)), b)
    b = re.sub(r'\bclippath\b', tag + '-clip', b)
    b = re.sub(r'\sid="Capa_\d+"', '', b)
    b = re.sub(r'\sdata-name="[^"]*"', '', b)
    return re.sub(r'>\s+<', '><', b).strip()


def hsl(color):
    h = color.lstrip('#')
    r, g, b = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    H, L, S = colorsys.rgb_to_hls(r, g, b)
    return H * 360, S, L


def caja(d):
    """Caja envolvente aproximada de un path, sin motor SVG.

    Recorre los comandos acumulando la posición y toma el mínimo/máximo de
    todos los puntos (incluidos los de control de las curvas). Es ligeramente
    más generosa que la caja real, pero basta de sobra para decidir si un
    trazo pertenece a la estaca o a la cuerda. Verificado contra las cajas
    exactas medidas en un navegador: da la misma clasificación.
    """
    tokens = re.findall(r'([MmLlHhVvCcSsQqTtAaZz])|(-?\d*\.?\d+(?:e-?\d+)?)', d)
    comandos, actual, numeros = [], None, []
    for letra, numero in tokens:
        if letra:
            if actual:
                comandos.append((actual, numeros))
            actual, numeros = letra, []
        else:
            numeros.append(float(numero))
    if actual:
        comandos.append((actual, numeros))

    PASOS = {'M': 2, 'L': 2, 'T': 2, 'H': 1, 'V': 1, 'C': 6, 'S': 4, 'Q': 4, 'A': 7, 'Z': 0}
    x = y = ix = iy = 0.0
    xs, ys = [], []
    for c, n in comandos:
        u, rel = c.upper(), c.islower()
        paso = PASOS[u]
        if u == 'Z':
            x, y = ix, iy
            xs.append(x); ys.append(y)
            continue
        for i in range(0, len(n), paso):
            g = n[i:i + paso]
            if len(g) < paso:
                break
            if u == 'H':
                nx, ny = (x + g[0]) if rel else g[0], y
            elif u == 'V':
                nx, ny = x, (y + g[0]) if rel else g[0]
            elif u == 'A':
                nx = (x + g[5]) if rel else g[5]
                ny = (y + g[6]) if rel else g[6]
            else:
                for j in range(0, paso, 2):
                    xs.append((x + g[j]) if rel else g[j])
                    ys.append((y + g[j + 1]) if rel else g[j + 1])
                nx = (x + g[paso - 2]) if rel else g[paso - 2]
                ny = (y + g[paso - 1]) if rel else g[paso - 1]
            xs.append(nx); ys.append(ny)
            x, y = nx, ny
            if u == 'M' and i == 0:
                ix, iy = x, y
    return min(xs), min(ys), max(xs), max(ys)


def piezas_de_perdedor():
    """Separa estaca, cuerda y pasto dentro de PERDEDOR.svg."""
    s = leer('PERDEDOR.svg')
    estilos = re.search(r'<style>(.*?)</style>', s, re.S).group(1)
    rellenos = dict(re.findall(r'\.(cls-\d+)\s*\{\s*fill:\s*(#[0-9a-fA-F]{6});', estilos))

    elementos = []
    for el in re.findall(r'<path\b[^>]*/>', s):
        d = re.search(r'\sd="([^"]+)"', el)
        c = re.search(r'class="([^"]+)"', el)
        if not d:
            continue
        elementos.append({'d': d.group(1), 'f': rellenos.get(c.group(1) if c else '', '#000')})

    for p in elementos:
        x0, y0, x1, y1 = caja(p['d'])
        p['cx'], p['cy'] = (x0 + x1) / 2, (y0 + y1) / 2
        p['H'], p['S'], _ = hsl(p['f'])

    verde = lambda p: 75 <= p['H'] <= 170 and p['S'] > 0.2
    estaca = [p for p in elementos if not verde(p) and p['cx'] < 250 and p['cy'] > 1250]
    cuerda = [p for p in elementos if 44 <= p['H'] <= 53 and p['S'] > 0.45 and p not in estaca]
    return estaca, cuerda


def pintar(lista):
    return ''.join('<path fill="%s" d="%s"/>' % (p['f'], p['d']) for p in lista)


def main():
    estaca, cuerda = piezas_de_perdedor()
    dx, dy = DESPLAZAMIENTO_PATAS_DELANTERAS

    estados = [
        ('estaca',           pintar(estaca)),
        ('cuerda',           pintar(estaca + cuerda)),
        ('cabeza',           con_prefijo(leer('cabeza.svg'), 's2')),
        ('torso',            con_prefijo(leer('cabeza y torso.svg'), 's3')),
        ('patasDelanteras',  '<g transform="translate(%s,%s)">%s</g>'
                             % (dx, dy, con_prefijo(leer('patas delanteras.svg'), 's4'))),
        ('patasTraseras',    con_prefijo(leer('patas traseras.svg'), 's5')),
        ('completo',         con_prefijo(leer('PERDEDOR.svg'), 's6')),
    ]

    siluetas = []
    for i, nombre in enumerate(['Mosca_1.svg', 'Mosca_2.svg', 'Mosca_3.svg']):
        s = leer(nombre)
        siluetas.append({
            'viewBox': re.search(r'viewBox="([^"]+)"', s).group(1),
            'svg': con_prefijo(s, 'm%d' % i),
        })

    out = ['// Generado por herramientas/generar_burro.py desde los SVG originales.',
           '// No editar a mano: vuelve a ejecutar el script si cambian los assets.',
           '',
           'export const VIEW_BOX = %s;' % json.dumps(VIEW_BOX),
           '',
           '// Suelo neutro dibujado aparte: el pasto del asset original lleva',
           '// recortadas las siluetas de las patas y dejaría huecos en los',
           '// estados donde el burro aún no las tiene.',
           'export const SUELO = %s;' % json.dumps(SUELO),
           '',
           'export const ESTADOS_BURRO = [']
    for id_, svg in estados:
        out.append('  { id: %s, svg: %s },' % (json.dumps(id_), json.dumps(svg)))
    out += ['];', '', 'export const SILUETAS = %s;' % json.dumps(siluetas, ensure_ascii=False), '']

    open(SALIDA, 'w', encoding='utf-8').write('\n'.join(out))
    print('burro.js generado: %d estados, %d KB'
          % (len(estados), os.path.getsize(SALIDA) // 1024))


if __name__ == '__main__':
    main()
