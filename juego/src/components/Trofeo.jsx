/**
 * Copa dibujada al estilo de los assets del burro:
 * trazo grueso color #53463b, relleno plano y una luz simple.
 */
export default function Trofeo({ className = 'trofeo' }) {
  return (
    <svg className={className} viewBox="0 0 260 300" role="img" aria-label="Copa de campeones">
      <g className="trofeo__brillo" fill="#F3DE93">
        <circle cx="130" cy="112" r="118" opacity=".5" />
      </g>

      <g stroke="#53463b" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round">
        <path d="M62 62H36c-16 0-26 13-24 30 4 34 26 54 52 58" fill="none" />
        <path d="M198 62h26c16 0 26 13 24 30-4 34-26 54-52 58" fill="none" />

        <path d="M62 34h136v72c0 44-30 76-68 76s-68-32-68-76V34z" fill="#E1C43D" />
        <path d="M86 46v58c0 26 10 44 26 52" fill="none" stroke="#F6E9A8" strokeWidth="12" />

        <rect x="52" y="20" width="156" height="24" rx="11" fill="#D9B435" />

        <path d="M130 182v34" fill="none" strokeWidth="18" stroke="#C2A52E" />
        <path d="M92 216h76l10 24H82z" fill="#D9B435" />
        <rect x="62" y="240" width="136" height="28" rx="11" fill="#B8942A" />

        <path
          d="M130 74l10.5 21.3 23.5 3.4-17 16.6 4 23.4-21-11-21 11 4-23.4-17-16.6 23.5-3.4z"
          fill="#FBF6EC"
          strokeWidth="7"
        />
      </g>
    </svg>
  );
}
