import React from 'react';

export function BapperidaLogo({ className = 'h-10 w-auto', showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg viewBox="0 0 200 120" className="w-full h-auto max-h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Inner Yellow Arch */}
        <path
          d="M68 90 V58 C68 40 82 26 100 26 C118 26 132 40 132 58 V90 Z"
          fill="#F59E0B"
        />
        {/* Outer Navy Thick Arch with extended horizontal feet */}
        <path
          d="M10 88 H50 V58 C50 30 72 8 100 8 C128 8 150 30 150 58 V88 H190"
          stroke="#0A1846"
          strokeWidth="18"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
      {showText && (
        <div className="flex items-baseline mt-1 font-sans tracking-tight text-[#0A1846]">
          <span className="text-xl md:text-2xl font-medium tracking-normal">bapperida</span>
          <span className="text-xl md:text-2xl font-black ml-1.5">pps</span>
        </div>
      )}
    </div>
  );
}

export function PapuaSelatanLogo({ className = 'h-12 w-auto' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 160 200" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E5EA8" />
            <stop offset="100%" stopColor="#0E3D73" />
          </linearGradient>
          <linearGradient id="spearGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#966122" />
            <stop offset="50%" stopColor="#C98B3B" />
            <stop offset="100%" stopColor="#784B16" />
          </linearGradient>
        </defs>

        {/* Shield Outer Red Border */}
        <path
          d="M12 12 H148 V140 C148 160 110 188 80 196 C50 188 12 160 12 140 Z"
          fill="#D92525"
        />
        {/* Shield White Inner Border */}
        <path
          d="M16 16 H144 V138 C144 156 108 184 80 191 C52 184 16 156 16 138 Z"
          fill="#FFFFFF"
        />
        {/* Shield Main Blue Field */}
        <path
          d="M20 20 H140 V136 C140 152 106 179 80 186 C54 179 20 152 20 136 Z"
          fill="url(#shieldGrad)"
        />

        {/* White Bar at Top */}
        <rect x="20" y="20" width="120" height="26" fill="#FFFFFF" />
        <line x1="20" y1="46" x2="140" y2="46" stroke="#D92525" strokeWidth="2.5" />
        <text
          x="80"
          y="39"
          textAnchor="middle"
          fill="#10427A"
          fontSize="13"
          fontWeight="900"
          fontFamily="sans-serif"
          letterSpacing="1"
        >
          PAPUA SELATAN
        </text>

        {/* Top Star */}
        <polygon
          points="80,51 83,59 91,59 85,64 87,72 80,67 73,72 75,64 69,59 77,59"
          fill="#FFD200"
          stroke="#E69500"
          strokeWidth="0.8"
        />

        {/* 3 Traditional Spears (Tombak) */}
        {/* Left spear */}
        <path d="M52 105 L54 62 L57 60 L60 62 L62 105 Z" fill="url(#spearGrad)" />
        <path d="M49 75 L56 70 L49 66 L56 61 L54 53 L58 53 L56 61 L63 66 L56 70 L63 75 Z" fill="#D9822B" />
        {/* Right spear */}
        <path d="M98 105 L100 62 L103 60 L106 62 L108 105 Z" fill="url(#spearGrad)" />
        <path d="M95 75 L102 70 L95 66 L102 61 L100 53 L104 53 L102 61 L109 66 L102 70 L109 75 Z" fill="#D9822B" />
        {/* Center spear (tallest) */}
        <path d="M78 80 L79 50 L80 47 L81 50 L82 80 Z" fill="#C98B3B" />

        {/* Musamus Pyramid / Central Monument */}
        {/* Diamond Base in facets */}
        <polygon points="50,110 80,68 110,110 80,132" fill="#88929A" stroke="#FFFFFF" strokeWidth="1.5" />
        <polygon points="50,110 65,126 80,132 80,105" fill="#6A737B" />
        <polygon points="110,110 95,126 80,132 80,105" fill="#7D868E" />
        <polygon points="50,110 80,68 80,105" fill="#A4AEB6" />
        <polygon points="110,110 80,68 80,105" fill="#919BA3" />

        {/* Red & White Division Center Line */}
        <polygon points="76,132 80,68 80,132" fill="#E22626" />
        <polygon points="80,68 84,132 80,132" fill="#FFFFFF" />

        {/* Asmat Spirals on Monument */}
        <path
          d="M74 95 Q68 95 68 100 Q68 106 74 106 Q76 106 78 104"
          fill="none"
          stroke="#1F2428"
          strokeWidth="2"
        />
        <path
          d="M86 95 Q92 95 92 100 Q92 106 86 106 Q84 106 82 104"
          fill="none"
          stroke="#1F2428"
          strokeWidth="2"
        />

        {/* Left Wreath - Rice (Padi) */}
        <g fill="#F5C000" stroke="#B88A00" strokeWidth="0.4">
          <ellipse cx="32" cy="70" rx="3.5" ry="6" transform="rotate(-30 32 70)" />
          <ellipse cx="28" cy="82" rx="3.5" ry="6" transform="rotate(-15 28 82)" />
          <ellipse cx="27" cy="95" rx="3.5" ry="6" transform="rotate(0 27 95)" />
          <ellipse cx="29" cy="108" rx="3.5" ry="6" transform="rotate(15 29 108)" />
          <ellipse cx="34" cy="120" rx="3.5" ry="6" transform="rotate(30 34 120)" />
          <ellipse cx="43" cy="130" rx="3.5" ry="6" transform="rotate(45 43 130)" />
        </g>

        {/* Right Wreath - Cotton (Kapas) */}
        <g fill="#F5C000" stroke="#B88A00" strokeWidth="0.4">
          <ellipse cx="128" cy="70" rx="3.5" ry="6" transform="rotate(30 128 70)" />
          <ellipse cx="132" cy="82" rx="3.5" ry="6" transform="rotate(15 132 82)" />
          <ellipse cx="133" cy="95" rx="3.5" ry="6" transform="rotate(0 133 95)" />
          <ellipse cx="131" cy="108" rx="3.5" ry="6" transform="rotate(-15 131 108)" />
          <ellipse cx="126" cy="120" rx="3.5" ry="6" transform="rotate(-30 126 120)" />
          <ellipse cx="117" cy="130" rx="3.5" ry="6" transform="rotate(-45 117 130)" />
        </g>
        {/* Cotton Flower Bolls */}
        <g fill="#FFFFFF" stroke="#0D723B" strokeWidth="0.8">
          <circle cx="36" cy="98" r="3" />
          <circle cx="38" cy="112" r="3" />
          <circle cx="43" cy="124" r="3" />
          <circle cx="124" cy="98" r="3" />
          <circle cx="122" cy="112" r="3" />
          <circle cx="117" cy="124" r="3" />
        </g>

        {/* Green Leaves at Base */}
        <path
          d="M36 138 C55 134 75 142 80 148 C85 142 105 134 124 138 C105 146 85 148 80 152 C75 148 55 146 36 138 Z"
          fill="#1CA643"
          stroke="#0B6B27"
          strokeWidth="0.8"
        />

        {/* Year 2022 */}
        <text
          x="80"
          y="145"
          textAnchor="middle"
          fill="#FFD200"
          fontSize="8.5"
          fontWeight="900"
          fontFamily="sans-serif"
          letterSpacing="0.5"
        >
          2022
        </text>

        {/* Tifa Drum with Motto Banner */}
        <rect x="42" y="150" width="76" height="15" rx="2" fill="#6A3B18" stroke="#FFE79A" strokeWidth="1" />
        <rect x="40" y="151" width="5" height="13" rx="1" fill="#FFFFFF" />
        <text
          x="81"
          y="161"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="7.5"
          fontWeight="900"
          fontFamily="sans-serif"
          letterSpacing="0.8"
        >
          MAJU NEGERIKU
        </text>

        {/* Traditional Wood Motif Underneath */}
        <path
          d="M60 166 L65 174 L75 174 L80 180 L85 174 L95 174 L100 166"
          fill="none"
          stroke="#C5893B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M72 176 L72 186 M88 176 L88 186"
          stroke="#C5893B"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function GovernmentBrandHeader({ 
  variant = 'dark',
  showSubtext = true,
  onClick
}: { 
  variant?: 'light' | 'dark';
  showSubtext?: boolean;
  onClick?: () => void;
}) {
  const isDark = variant === 'dark';
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-2">
        <PapuaSelatanLogo className="h-10 w-auto" />
        <div className="h-8 w-px bg-slate-300 dark:bg-slate-600/60 hidden sm:block"></div>
        <BapperidaLogo className="h-9 w-auto" showText={false} />
      </div>
      <div className="flex flex-col">
        <span className={`text-[11px] font-semibold uppercase tracking-wider ${
          isDark ? 'text-amber-400' : 'text-amber-600'
        }`}>
          Pemerintah Provinsi Papua Selatan
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-base sm:text-lg font-bold tracking-tight leading-none ${
            isDark ? 'text-white' : 'text-[#0f3d5c]'
          }`}>
            BAPPERIDA
          </span>
          <span className={`text-xs sm:text-sm font-semibold leading-none ${
            isDark ? 'text-slate-200' : 'text-slate-600'
          }`}>
            PROVINSI PAPUA SELATAN
          </span>
        </div>
        {showSubtext && (
          <span className={`text-[10px] sm:text-[11px] leading-tight mt-0.5 line-clamp-1 ${
            isDark ? 'text-slate-300' : 'text-slate-500'
          }`}>
            Badan Perencanaan Pembangunan Daerah, Riset dan Inovasi Daerah
          </span>
        )}
      </div>
    </div>
  );
}
