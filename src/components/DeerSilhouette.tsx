import React from 'react';

interface DeerSilhouetteProps {
  className?: string;
  opacity?: number;
}

/**
 * Siluet Rusa Papua Selatan (Rusa Merauke / Cervus timorensis)
 * Simbol fauna kebanggaan dan ikon identitas Anim Ha / Merauke, Papua Selatan.
 */
export function DeerSilhouette({ className = 'w-48 h-48 text-white/20', opacity }: DeerSilhouetteProps) {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={opacity !== undefined ? { opacity } : undefined}
      aria-hidden="true"
    >
      {/* Siluet Kepala & Tubuh Rusa dengan Tanduk Bercabang Khas Rusa Merauke */}
      <g transform="translate(10, 5)">
        {/* Antlers (Tanduk Bercabang Megah) */}
        <path d="M142 108 C140 95, 132 80, 118 68 C110 61, 98 55, 84 52 C81 51, 80 48, 82 46 C86 42, 95 44, 106 48 C118 53, 128 62, 136 74 C132 60, 122 45, 108 34 C100 28, 88 24, 76 22 C73 21, 74 18, 77 17 C84 15, 96 17, 108 22 C124 29, 137 42, 145 58 C144 42, 138 28, 127 16 C122 11, 114 6, 104 3 C101 2, 103 -1, 106 0 C116 2, 128 9, 138 18 C150 30, 158 46, 160 64 C163 46, 172 30, 184 18 C194 9, 206 2, 216 0 C219 -1, 221 2, 218 3 C208 6, 200 11, 195 16 C184 28, 178 42, 177 58 C185 42, 198 29, 214 22 C226 17, 238 15, 245 17 C248 18, 249 21, 246 22 C234 24, 222 28, 214 34 C200 45, 190 60, 186 74 C194 62, 204 53, 216 48 C227 44, 236 42, 240 46 C242 48, 241 51, 238 52 C224 55, 212 61, 204 68 C190 80, 182 95, 180 108 C176 114, 170 118, 161 120 C152 118, 146 114, 142 108 Z" />

        {/* Telinga Kiri */}
        <path d="M136 116 C124 112, 105 106, 92 112 C86 115, 84 121, 88 125 C96 132, 115 130, 132 126 C136 125, 137 120, 136 116 Z" />

        {/* Telinga Kanan */}
        <path d="M186 116 C198 112, 217 106, 230 112 C236 115, 238 121, 234 125 C226 132, 207 130, 190 126 C186 125, 185 120, 186 116 Z" />

        {/* Kepala & Moncong */}
        <path d="M140 120 C138 135, 142 152, 148 168 C150 174, 152 184, 154 190 C156 195, 160 197, 163 197 C166 197, 170 195, 172 190 C174 184, 176 174, 178 168 C184 152, 188 135, 186 120 C178 124, 168 126, 161 126 C154 126, 144 124, 140 120 Z" />

        {/* Leher Gagah & Bahu Dada */}
        <path d="M144 172 C138 190, 126 215, 112 242 C98 268, 76 295, 52 312 L270 312 C246 295, 224 268, 210 242 C196 215, 184 190, 178 172 C172 178, 168 182, 161 182 C154 182, 150 178, 144 172 Z" />

        {/* Aksentuasi Dada & Kilau Anatomi */}
        <path d="M161 192 C157 205, 152 225, 148 250 C146 265, 144 285, 140 312 L182 312 C178 285, 176 265, 174 250 C170 225, 165 205, 161 192 Z" opacity="0.18" />
      </g>
    </svg>
  );
}

/**
 * Siluet Rusa Berdiri Penuh (Full Body Stag Silhouette)
 * Tampak samping elegan khas savana Wasur & Anim Ha
 */
export function FullDeerSilhouette({ className = 'w-64 h-64 text-white/20' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 360"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g transform="translate(10, 10)">
        {/* Antlers / Tanduk Bercabang Rusa Merauke */}
        <path d="M112 72 C110 58, 98 42, 82 30 C74 24, 62 18, 48 16 C45 15, 46 12, 49 11 C58 9, 72 12, 84 18 C98 25, 109 37, 115 50 C114 36, 106 22, 94 12 C86 5, 74 2, 62 0 C59 -1, 60 -3, 63 -2 C74 0, 88 5, 99 14 C112 25, 120 40, 122 56 C125 40, 134 26, 146 16 C156 8, 168 2, 178 0 C181 -1, 182 2, 179 3 C169 6, 159 11, 151 18 C140 28, 133 42, 132 58 C140 44, 152 32, 166 25 C178 19, 189 16, 194 18 C197 19, 196 22, 193 23 C180 26, 169 32, 161 40 C148 52, 142 66, 140 80 C136 85, 128 88, 120 88 C115 84, 113 78, 112 72 Z" />

        {/* Kepala Menengadah Gagah */}
        <path d="M106 82 C100 80, 82 86, 74 94 C70 98, 68 104, 73 106 C80 109, 94 104, 104 98 C108 104, 114 112, 120 120 C124 126, 128 136, 130 148 C124 154, 118 164, 115 178 C110 198, 106 218, 98 230 C88 232, 75 234, 62 238 C54 240, 48 245, 52 252 C56 260, 68 258, 80 255 C82 268, 80 285, 78 310 C77 318, 76 328, 74 338 C73 342, 76 345, 80 345 C84 345, 86 341, 87 335 C92 312, 96 288, 100 268 C115 264, 140 260, 168 260 C194 260, 220 265, 238 270 C242 288, 246 312, 250 335 C251 341, 253 345, 257 345 C261 345, 264 342, 263 338 C260 318, 256 295, 254 278 C266 270, 276 258, 280 242 C285 224, 280 208, 272 195 C260 178, 238 170, 215 168 C192 166, 172 168, 155 172 C150 156, 144 140, 138 126 C134 115, 130 102, 125 90 C122 84, 114 82, 106 82 Z" />

        {/* Kaki Depan & Belakang yang Ramping Tangkas */}
        <path d="M126 260 C124 280, 120 305, 116 332 C115 338, 117 342, 121 342 C125 342, 128 338, 129 332 C134 305, 138 280, 140 260 Z" opacity="0.85" />
        <path d="M214 264 C212 282, 208 306, 204 332 C203 338, 205 342, 209 342 C213 342, 216 338, 217 332 C222 306, 226 282, 228 264 Z" opacity="0.85" />

        {/* Ekor Rusa */}
        <path d="M280 226 C288 230, 296 238, 294 246 C292 252, 285 252, 280 246 C278 240, 278 232, 280 226 Z" />
      </g>
    </svg>
  );
}
