import React from 'react';

interface PersonSilhouetteProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Komponen Siluet Orang Resmi untuk Pegawai Bapperida PPS
 * Ditampilkan jika pegawai belum memiliki foto profil resmi.
 */
export function PersonSilhouette({ className = '', size = 'md' }: PersonSilhouetteProps) {
  const sizeClasses = {
    sm: 'w-20 h-24',
    md: 'w-36 h-44',
    lg: 'w-48 h-60',
    xl: 'w-60 h-72'
  }[size];

  return (
    <div className={`relative flex items-end justify-center overflow-hidden select-none ${sizeClasses} ${className}`}>
      <svg
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-slate-400 drop-shadow-xs"
      >
        {/* Head and Hair Silhouette */}
        <circle cx="100" cy="62" r="38" fill="currentColor" opacity="0.85" />
        
        {/* Neck */}
        <path
          d="M86 94H114V118C114 122 110 126 106 126H94C90 126 86 122 86 118V94Z"
          fill="currentColor"
          opacity="0.85"
        />
        
        {/* Torso & Suit / Shoulders Silhouette */}
        <path
          d="M32 240C32 175 60 134 88 126C92 125 96 127 100 127C104 127 108 125 112 126C140 134 168 175 168 240H32Z"
          fill="currentColor"
          opacity="0.9"
        />

        {/* Collar & Tie Accent in subtle lighter tone */}
        <path
          d="M100 127L88 152H112L100 127Z"
          fill="white"
          opacity="0.25"
        />
        <path
          d="M96 154L94 200L100 215L106 200L104 154H96Z"
          fill="white"
          opacity="0.2"
        />
      </svg>
    </div>
  );
}
