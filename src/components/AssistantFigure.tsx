type AssistantFigureProps = {
  active?: boolean;
  caption?: string;
  compact?: boolean;
};

export default function AssistantFigure({
  active = false,
  caption = "Ask me about Joshua",
  compact = false,
}: AssistantFigureProps) {
  return (
    <div
      className="assistant-presence"
      data-active={active}
      data-compact={compact}
      aria-hidden="true"
    >
      <div className="assistant-presence-bubble">
        <span className="assistant-presence-bubble-dot" />
        {caption}
      </div>

      <svg
        viewBox="0 0 320 280"
        className="assistant-presence-svg"
        fill="none"
        role="presentation"
      >
        <defs>
          <radialGradient
            id="assistant-card-skin"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(144 72) rotate(42) scale(112 128)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffe9d7" />
            <stop offset="58%" stopColor="#ffcda9" />
            <stop offset="100%" stopColor="#e1a27d" />
          </radialGradient>
          <radialGradient
            id="assistant-card-face-shadow"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(184 118) rotate(135) scale(82 98)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#cf8e6b" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#cf8e6b" stopOpacity="0" />
          </radialGradient>
          <linearGradient
            id="assistant-card-jacket"
            x1="106"
            y1="132"
            x2="214"
            y2="214"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#353940" />
            <stop offset="52%" stopColor="#1f2328" />
            <stop offset="100%" stopColor="#111418" />
          </linearGradient>
          <linearGradient
            id="assistant-card-jacket-shine"
            x1="126"
            y1="136"
            x2="178"
            y2="208"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#6a707a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#6a707a" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="assistant-card-shirt"
            x1="132"
            y1="134"
            x2="188"
            y2="198"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e9edf3" />
          </linearGradient>
          <linearGradient
            id="assistant-card-tie"
            x1="164"
            y1="136"
            x2="164"
            y2="196"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#f25f4c" />
            <stop offset="100%" stopColor="#cb4738" />
          </linearGradient>
          <linearGradient
            id="assistant-card-laptop"
            x1="72"
            y1="166"
            x2="212"
            y2="236"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#fdfdfd" />
            <stop offset="100%" stopColor="#d9dee6" />
          </linearGradient>
          <linearGradient
            id="assistant-card-screen"
            x1="90"
            y1="176"
            x2="186"
            y2="220"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#fafbfd" />
            <stop offset="100%" stopColor="#ebf1f7" />
          </linearGradient>
          <linearGradient
            id="assistant-card-laptop-edge"
            x1="88"
            y1="225"
            x2="216"
            y2="246"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#cfd5dd" />
            <stop offset="100%" stopColor="#b6bcc5" />
          </linearGradient>
          <radialGradient
            id="assistant-card-hair"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(138 42) rotate(34) scale(108 94)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#353a42" />
            <stop offset="56%" stopColor="#1c2025" />
            <stop offset="100%" stopColor="#090a0c" />
          </radialGradient>
          <linearGradient
            id="assistant-card-hair-shine"
            x1="120"
            y1="40"
            x2="172"
            y2="86"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#868d99" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#868d99" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="assistant-card-badge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5aa3ff" />
            <stop offset="100%" stopColor="#2d78d8" />
          </linearGradient>
          <filter
            id="assistant-card-shadow"
            x="76"
            y="28"
            width="170"
            height="228"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#1a1d21" floodOpacity="0.18" />
          </filter>
          <filter
            id="assistant-card-badge-shadow"
            x="28"
            y="20"
            width="272"
            height="122"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#336cb8" floodOpacity="0.2" />
          </filter>
        </defs>

        <ellipse className="assistant-character-shadow" cx="160" cy="254" rx="84" ry="16" />

        <g filter="url(#assistant-card-badge-shadow)">
          <g className="assistant-character-badge assistant-character-badge-left">
            <rect x="34" y="70" width="48" height="36" rx="12" fill="url(#assistant-card-badge)" />
            <path d="M48 88h20M58 80v16" stroke="#ffffff" strokeLinecap="round" strokeWidth="3" />
          </g>

          <g className="assistant-character-badge assistant-character-badge-top">
            <rect x="72" y="26" width="62" height="40" rx="14" fill="url(#assistant-card-badge)" />
            <text
              x="103"
              y="52"
              fill="#ffffff"
              fontFamily="Arial, sans-serif"
              fontSize="16"
              fontWeight="700"
              textAnchor="middle"
            >
              JS
            </text>
          </g>

          <g className="assistant-character-badge assistant-character-badge-right">
            <rect x="240" y="42" width="50" height="38" rx="12" fill="url(#assistant-card-badge)" />
            <path
              d="m254 61 7-7m0 0 7 7m-7-7v14m-7-7h14"
              stroke="#ffffff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.8"
            />
          </g>

          <g className="assistant-character-badge assistant-character-badge-small">
            <circle cx="58" cy="126" r="18" fill="url(#assistant-card-badge)" />
            <text
              x="58"
              y="132"
              fill="#ffffff"
              fontFamily="Arial, sans-serif"
              fontSize="12"
              fontWeight="700"
              textAnchor="middle"
            >
              AI
            </text>
          </g>
        </g>

        <g className="assistant-character-figure" filter="url(#assistant-card-shadow)">
          <path
            d="M117 136c12-12 27-18 43-18 22 0 38 6 49 18l17 55H95l22-55Z"
            fill="url(#assistant-card-jacket)"
          />
          <path
            d="M133 140c8-6 18-9 28-9 11 0 21 3 29 9l-6 49h-46l-5-49Z"
            fill="url(#assistant-card-shirt)"
          />
          <path
            d="M146 139h11l-8 18-17 16-7-25c6-5 14-9 21-9Z"
            fill="url(#assistant-card-jacket)"
          />
          <path
            d="M174 139h-11l8 18 17 16 7-25c-6-5-14-9-21-9Z"
            fill="url(#assistant-card-jacket)"
          />
          <path
            d="M150 139h10l-5 11-12 13-8-15c4-5 9-8 15-9Z"
            fill="#ffffff"
          />
          <path
            d="M170 139h-10l5 11 12 13 8-15c-4-5-9-8-15-9Z"
            fill="#ffffff"
          />
          <path d="M156 137h8l10 55h-28l10-55Z" fill="url(#assistant-card-tie)" />
          <path
            d="M120 143c10 3 18 8 24 15l-15 31-26-6 17-40Z"
            fill="url(#assistant-card-jacket-shine)"
          />
          <path
            d="M201 145c-9 2-17 8-23 15l15 29 24-7-16-37Z"
            fill="rgba(255,255,255,0.05)"
          />

          <path
            d="M100 170c10-13 22-19 35-20l19 14-16 19-42 2 4-15Z"
            fill="url(#assistant-card-jacket)"
          />
          <path
            d="M220 170c-10-13-22-19-35-20l-19 14 16 19 42 2-4-15Z"
            fill="url(#assistant-card-jacket)"
          />
          <path
            d="M116 179c12-4 24-3 34 2l-8 12c-11 3-22 5-32 4l-1-8 7-10Z"
            fill="url(#assistant-card-skin)"
          />
          <path
            d="M204 179c-12-4-24-3-34 2l8 12c11 3 22 5 32 4l1-8-7-10Z"
            fill="url(#assistant-card-skin)"
          />
          <path
            d="M118 182c9 0 18 2 27 6l-5 7c-9 1-18 1-26-1l4-12Z"
            fill="rgba(224,162,125,0.46)"
          />
          <path
            d="M202 182c-9 0-18 2-27 6l5 7c9 1 18 1 26-1l-4-12Z"
            fill="rgba(224,162,125,0.46)"
          />

          <g className="assistant-character-laptop">
            <path
              d="M75 171c0-8 7-15 15-15h111c9 0 16 7 16 15v44c0 9-7 16-16 16H90c-8 0-15-7-15-16v-44Z"
              fill="url(#assistant-card-laptop)"
            />
            <path
              d="M88 180c0-5 4-10 10-10h95c6 0 10 5 10 10v28c0 6-4 10-10 10H98c-6 0-10-4-10-10v-28Z"
              className="assistant-character-screen"
              fill="url(#assistant-card-screen)"
            />
            <path
              d="M72 225h148l-8 13c-2 4-6 6-11 6H92c-5 0-9-2-11-6l-9-13Z"
              fill="url(#assistant-card-laptop-edge)"
            />
            <path
              d="M103 183h79c6 0 10 5 10 10v6c-24-10-54-7-89 10v-16c0-5 4-10 10-10Z"
              fill="rgba(255,255,255,0.32)"
            />
            <circle cx="147" cy="200" r="4.5" fill="#c2c8d0" />
          </g>

          <path
            d="M142 108h36v33c0 10-8 18-18 18s-18-8-18-18v-33Z"
            fill="url(#assistant-card-skin)"
          />
          <ellipse cx="160" cy="86" rx="47" ry="51" fill="url(#assistant-card-skin)" />
          <ellipse cx="173" cy="101" rx="37" ry="38" fill="url(#assistant-card-face-shadow)" />
          <path
            d="M116 84c0-35 24-55 52-55 22 0 39 11 47 29-10-5-20-7-31-7-17 0-31 5-41 16-10 11-17 18-27 17V84Z"
            fill="url(#assistant-card-hair)"
          />
          <path
            d="M118 80c11-21 30-34 51-34 12 0 24 4 35 13-18 4-33 15-47 27-10 9-25 13-39 10V80Z"
            fill="url(#assistant-card-hair)"
          />
          <path
            d="M129 52c12-10 24-15 39-15 10 0 19 3 28 8-8 1-14 4-23 9-16 8-26 9-44 6v-8Z"
            fill="url(#assistant-card-hair-shine)"
          />
          <circle cx="114" cy="92" r="7" fill="url(#assistant-card-skin)" />
          <circle cx="206" cy="92" r="7" fill="url(#assistant-card-skin)" />

          <circle cx="145" cy="91" r="19" stroke="#473e39" strokeWidth="4" fill="#ffffff" fillOpacity="0.16" />
          <circle cx="176" cy="91" r="19" stroke="#473e39" strokeWidth="4" fill="#ffffff" fillOpacity="0.16" />
          <path d="M162 91h-4" stroke="#473e39" strokeWidth="4" strokeLinecap="round" />
          <path d="M128 81.5h13M180.5 81.5h13" stroke="#473e39" strokeLinecap="round" strokeWidth="3" />

          <ellipse className="assistant-character-eye" cx="145" cy="93" rx="3.6" ry="4.8" fill="#26282d" />
          <ellipse className="assistant-character-eye" cx="176" cy="93" rx="3.6" ry="4.8" fill="#26282d" />
          <circle cx="143.7" cy="91.3" r="0.9" fill="#ffffff" />
          <circle cx="174.7" cy="91.3" r="0.9" fill="#ffffff" />
          <path
            d="M153 95c0 7 2 11 7 11"
            stroke="#d58a68"
            strokeLinecap="round"
            strokeWidth="2.4"
          />
          <path
            d="M151 114c4 5 15 5 19 0"
            stroke="#98523d"
            strokeLinecap="round"
            strokeWidth="3.2"
          />
          <path
            d="M132 108c3 2 6 3 9 3M179 111c2 0 5-1 8-3"
            stroke="#efb39b"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </g>
      </svg>
    </div>
  );
}
