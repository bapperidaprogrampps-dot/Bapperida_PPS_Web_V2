import React, { useId } from 'react';

interface TopographicBackgroundProps {
  className?: string;
  opacity?: number;
  color?: string;
  /**
   * Skala ukuran pola kontur tanah (default: 0.85).
   * Nilai lebih kecil (misal 0.7 - 0.9) membuat bentuk bukit, lembah, dan puncak terlihat jelas.
   */
  scale?: number;
}

/**
 * TopographicBackground
 * 
 * Komponen latar belakang kontur tanah presisi tinggi berdasarkan acuan peta topografi (kontur.jpg):
 * - Skala disesuaikan rapat dan proporsional sehingga seluruh morfologi kontur (puncak melingkar,
 *   lembah re-entrant, lereng terjal, dan pelana kontur) terlihat jelas bentuknya.
 * - Garis tebal (strokeWidth 1.7px): Kontur Indeks (Index Contours) setiap kelipatan elevasi utama
 * - Garis tipis (strokeWidth 0.65px): Kontur Antara (Intermediate Contours) di antara kontur indeks
 * - Berulang secara mulus (seamless pattern) di seluruh kanvas latar belakang layer paling belakang (-z-10)
 */
export function TopographicBackground({ 
  className = '', 
  opacity = 0.22,
  color = '#0f3d5c',
  scale = 0.85
}: TopographicBackgroundProps) {
  const uniqueId = useId().replace(/:/g, '');
  const patternId = `topo-pattern-${uniqueId}`;

  // Dimensi dasar pola kontur (560px x 740px)
  // Diskala sesuai prop agar bentuk relief topografi terlihat jelas dan padat
  const baseWidth = 560;
  const baseHeight = 740;
  const patternWidth = Math.round(baseWidth * scale);
  const patternHeight = Math.round(baseHeight * scale);

  const indexColor = color;
  const intermediateColor = color;

  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none -z-10 ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <svg 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern 
            id={patternId} 
            width={patternWidth} 
            height={patternHeight} 
            viewBox={`0 0 ${baseWidth} ${baseHeight}`} 
            patternUnits="userSpaceOnUse"
          >
            {/* =================================================================
                ZONE 1: NORTHERN RIDGES & CRESTS (y: 10 - 130)
                ================================================================= */}
            
            {/* Index Contour 1 (Thick) */}
            <path 
              d="M -10,25 C 60,18 120,40 190,35 C 260,30 330,12 400,10 C 460,8 510,28 570,25" 
              stroke={indexColor} 
              strokeWidth="1.75" 
              strokeOpacity="0.88" 
            />

            {/* Intermediates */}
            <path 
              d="M -10,48 C 65,40 125,62 195,58 C 265,52 335,32 405,30 C 465,28 512,50 570,48" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />
            <path 
              d="M -10,70 C 70,62 130,85 200,80 C 270,75 340,52 410,50 C 470,48 515,72 570,70" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />
            <path 
              d="M -10,92 C 75,85 135,108 205,102 C 275,98 345,72 415,70 C 475,68 518,95 570,92" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />
            <path 
              d="M -10,115 C 80,108 140,130 210,125 C 280,120 350,92 420,90 C 480,88 520,118 570,115" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />


            {/* =================================================================
                ZONE 2: UPPER ESCARPMENT & NORTHEAST SPUR (y: 135 - 250)
                Tight contour spacing on upper-right as in kontur.jpg
                ================================================================= */}

            {/* Index Contour 2 (Thick) */}
            <path 
              d="M -10,140 C 70,132 140,158 215,152 C 285,145 340,175 390,170 C 435,165 470,115 515,108 C 535,105 550,138 570,140" 
              stroke={indexColor} 
              strokeWidth="1.75" 
              strokeOpacity="0.88" 
            />

            {/* Intermediates */}
            <path 
              d="M -10,162 C 65,155 135,180 210,175 C 280,168 335,202 390,195 C 440,188 475,128 518,120 C 538,116 550,160 570,162" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />
            <path 
              d="M -10,185 C 60,178 130,202 205,198 C 275,192 330,230 390,220 C 445,212 480,140 520,132 C 540,128 552,182 570,185" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />
            <path 
              d="M -10,208 C 55,200 125,225 200,220 C 270,215 325,258 390,245 C 450,235 485,152 522,145 C 542,140 555,205 570,208" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />
            <path 
              d="M -10,230 C 50,222 120,248 195,242 C 265,238 320,285 390,270 C 455,258 490,165 525,158 C 545,152 558,228 570,230" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />

            {/* Nested knoll on northeast spur (kontur.jpg) */}
            <path 
              d="M 488,185 C 480,168 495,152 515,150 C 530,148 542,162 538,180 C 532,198 500,202 488,185 Z" 
              stroke={intermediateColor} 
              strokeWidth="0.75" 
              strokeOpacity="0.5" 
            />
            <ellipse cx="512" cy="176" rx="10" ry="6" stroke={indexColor} strokeWidth="1.2" strokeOpacity="0.8" />


            {/* =================================================================
                ZONE 3: CENTRAL AMPHITHEATER & BROAD VALLEY BASIN (y: 255 - 420)
                Dramatic curved isolines dipping through mid-terrain
                ================================================================= */}

            {/* Index Contour 3 (Thick) */}
            <path 
              d="M -10,255 C 45,245 115,270 190,265 C 260,260 310,325 390,305 C 460,285 500,200 540,225 C 555,235 562,250 570,255" 
              stroke={indexColor} 
              strokeWidth="1.8" 
              strokeOpacity="0.9" 
            />

            {/* Intermediates sweeping through the central basin */}
            <path 
              d="M -10,280 C 40,270 110,295 182,290 C 255,285 305,355 385,335 C 465,315 505,235 545,255 C 555,260 562,275 570,280" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />
            <path 
              d="M -10,305 C 35,295 105,320 175,315 C 250,310 300,385 380,365 C 470,345 510,270 548,285 C 558,290 565,300 570,305" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />
            <path 
              d="M -10,330 C 30,320 100,345 168,340 C 245,335 295,415 375,395 C 475,375 515,305 550,315 C 560,318 565,325 570,330" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />
            <path 
              d="M -10,355 C 25,345 95,370 160,365 C 240,360 290,445 370,425 C 480,405 520,340 552,345 C 562,348 568,350 570,355" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />


            {/* =================================================================
                ZONE 4: TRANSITION SLOPES & APPROACH TO SOUTHERN PEAK (y: 380 - 520)
                ================================================================= */}

            {/* Index Contour 4 (Thick) */}
            <path 
              d="M -10,380 C 20,370 88,395 152,390 C 235,385 285,475 365,455 C 470,432 525,370 555,372 C 562,374 568,378 570,380" 
              stroke={indexColor} 
              strokeWidth="1.8" 
              strokeOpacity="0.9" 
            />

            {/* Intermediates */}
            <path 
              d="M -10,408 C 15,398 82,422 145,418 C 230,412 280,505 360,485 C 460,460 528,398 558,400 C 565,402 568,405 570,408" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />
            <path 
              d="M -10,435 C 10,425 75,450 138,445 C 225,440 275,535 355,515 C 450,488 530,425 560,428 C 565,430 568,432 570,435" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />
            <path 
              d="M -10,462 C 5,452 68,478 130,472 C 220,468 270,565 350,545 C 440,515 532,452 562,455 C 566,458 568,460 570,462" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />
            <path 
              d="M -10,490 C 0,480 62,505 122,500 C 215,495 265,595 345,575 C 430,542 535,480 565,482 C 568,485 569,488 570,490" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />


            {/* =================================================================
                ZONE 5: THE DISTINCTIVE LOWER-LEFT SUMMIT PEAK (y: 520 - 720)
                Concentric closed contour rings clearly depicting mountain summit
                (Exact defining feature of kontur.jpg!)
                ================================================================= */}

            {/* Index Contour 5 (Thick outer contour wrapping the peak) */}
            <path 
              d="M -10,520 C -5,510 55,535 115,530 C 210,525 260,625 340,605 C 420,570 538,510 566,512 C 568,515 569,518 570,520" 
              stroke={indexColor} 
              strokeWidth="1.8" 
              strokeOpacity="0.9" 
            />

            {/* Intermediate loops wrapping around the summit */}
            <path 
              d="M -10,550 C -8,540 45,568 105,562 C 202,555 255,655 332,635 C 410,600 540,540 568,542 L 570,550" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />
            <path 
              d="M -10,580 C -8,570 38,600 95,595 C 195,585 250,685 325,665 C 400,630 542,570 568,572 L 570,580" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />

            {/* Concentric rings of the mountain summit (Lower Left) */}
            {/* Ring 1 - Outer Ring (Index Contour) */}
            <path 
              d="M 52,652 C 38,630 55,605 92,600 C 135,595 168,620 162,658 C 158,695 125,720 85,715 C 50,710 38,680 52,652 Z" 
              stroke={indexColor} 
              strokeWidth="1.75" 
              strokeOpacity="0.92" 
            />

            {/* Ring 2 - Intermediate */}
            <path 
              d="M 62,654 C 50,638 65,618 95,614 C 128,610 152,628 148,658 C 144,685 118,705 88,700 C 60,695 50,672 62,654 Z" 
              stroke={intermediateColor} 
              strokeWidth="0.75" 
              strokeOpacity="0.55" 
            />

            {/* Ring 3 - Intermediate */}
            <path 
              d="M 72,655 C 62,642 75,626 98,624 C 122,620 140,635 136,658 C 132,678 110,692 88,688 C 68,685 62,668 72,655 Z" 
              stroke={intermediateColor} 
              strokeWidth="0.75" 
              strokeOpacity="0.55" 
            />

            {/* Ring 4 - Inner Summit Ridge (Index Contour) */}
            <ellipse 
              cx="102" 
              cy="656" 
              rx="20" 
              ry="14" 
              stroke={indexColor} 
              strokeWidth="1.5" 
              strokeOpacity="0.9" 
            />

            {/* Ring 5 - Summit Peak Center */}
            <ellipse 
              cx="102" 
              cy="656" 
              rx="9" 
              ry="6" 
              stroke={intermediateColor} 
              strokeWidth="0.8" 
              strokeOpacity="0.75" 
            />


            {/* =================================================================
                ZONE 6: SOUTHERN SADDLE & SOUTHEAST SPUR (y: 605 - 740)
                Contours connecting the summit to the southeast landform
                ================================================================= */}

            {/* Index Contour 6 (Thick) */}
            <path 
              d="M -10,610 C 15,620 28,685 70,725 C 120,770 190,750 250,710 C 310,670 420,680 490,705 C 530,720 555,680 570,675" 
              stroke={indexColor} 
              strokeWidth="1.75" 
              strokeOpacity="0.9" 
            />

            {/* Intermediates */}
            <path 
              d="M -10,640 C 10,650 24,705 65,745 C 115,788 185,770 245,730 C 305,690 415,700 485,725 C 528,740 555,700 570,698" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />
            <path 
              d="M -10,670 C 5,680 20,725 60,765 C 110,805 180,788 240,750 C 300,710 410,720 480,745 C 525,760 555,720 570,718" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />
            <path 
              d="M -10,700 C 0,710 16,745 55,785 C 105,825 175,808 235,770 C 295,730 405,740 475,765 C 522,780 555,740 570,738" 
              stroke={intermediateColor} 
              strokeWidth="0.65" 
              strokeOpacity="0.45" 
            />

            {/* Southeast knoll closed loop (kontur.jpg feature) */}
            <path 
              d="M 430,715 C 448,690 485,695 498,720 C 505,745 480,765 455,758 C 432,745 422,728 430,715 Z" 
              stroke={intermediateColor} 
              strokeWidth="0.75" 
              strokeOpacity="0.5" 
            />
            <ellipse cx="465" cy="728" rx="12" ry="7" stroke={indexColor} strokeWidth="1.2" strokeOpacity="0.85" />

          </pattern>
        </defs>

        {/* Render Pattern seamlessly over 100% of the canvas */}
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
