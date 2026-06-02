import React from 'react';

interface TaijiCompassProps {
  size?: number;
  className?: string;
}

export const TaijiCompass: React.FC<TaijiCompassProps> = ({ size = 120, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`taiji-spin ${className}`}
    >
      {/* Outer ring */}
      <circle cx="100" cy="100" r="95" stroke="#C9A574" strokeWidth="1.5" fill="none" opacity="0.3" />
      <circle cx="100" cy="100" r="85" stroke="#C9A574" strokeWidth="0.5" fill="none" opacity="0.2" />

      {/* Tick marks around the ring */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const inner = i % 6 === 0 ? 78 : 83;
        const x1 = 100 + inner * Math.cos(angle);
        const y1 = 100 + inner * Math.sin(angle);
        const x2 = 100 + 90 * Math.cos(angle);
        const y2 = 100 + 90 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#C9A574"
            strokeWidth={i % 6 === 0 ? 1.5 : 0.5}
            opacity={i % 6 === 0 ? 0.6 : 0.3}
          />
        );
      })}

      {/* Yin-Yang main body */}
      {/* Left half (dark) */}
      <path d="M100 20 A80 80 0 0 0 100 180 A40 40 0 0 0 100 100 A40 40 0 0 1 100 20" fill="#3F3C37" />
      {/* Right half (light) */}
      <path d="M100 20 A80 80 0 0 1 100 180 A40 40 0 0 1 100 100 A40 40 0 0 0 100 20" fill="#F2EFE6" />

      {/* Dark dot in light half */}
      <circle cx="100" cy="60" r="10" fill="#3F3C37" />
      {/* Light dot in dark half */}
      <circle cx="100" cy="140" r="10" fill="#F2EFE6" />

      {/* Cardinal direction labels */}
      <text x="100" y="14" textAnchor="middle" fill="#C9A574" fontSize="10" fontWeight="600" fontFamily="serif">北</text>
      <text x="100" y="198" textAnchor="middle" fill="#C9A574" fontSize="10" fontWeight="600" fontFamily="serif">南</text>
      <text x="8" y="104" textAnchor="middle" fill="#C9A574" fontSize="10" fontWeight="600" fontFamily="serif">西</text>
      <text x="192" y="104" textAnchor="middle" fill="#C9A574" fontSize="10" fontWeight="600" fontFamily="serif">東</text>
    </svg>
  );
};

export const KoiFish: React.FC<{ size?: number; className?: string }> = ({ size = 80, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`koi-swim ${className}`}
    >
      {/* Body */}
      <path
        d="M30 60 Q60 20, 120 40 Q160 50, 170 60 Q160 70, 120 80 Q60 100, 30 60Z"
        fill="#C9553D"
        opacity="0.9"
      />
      {/* Belly */}
      <path
        d="M50 60 Q80 75, 130 70 Q150 65, 155 60 Q150 55, 130 55 Q80 50, 50 60Z"
        fill="#F2EFE6"
        opacity="0.6"
      />
      {/* Tail */}
      <path
        d="M30 60 Q10 40, 5 30 Q20 50, 25 55Z"
        fill="#C9A574"
        opacity="0.8"
      />
      <path
        d="M30 60 Q10 80, 5 90 Q20 70, 25 65Z"
        fill="#C9A574"
        opacity="0.8"
      />
      {/* Dorsal fin */}
      <path
        d="M90 42 Q100 25, 115 38"
        fill="#C9553D"
        opacity="0.7"
      />
      {/* Spots */}
      <circle cx="85" cy="52" r="6" fill="#F2EFE6" opacity="0.5" />
      <circle cx="110" cy="48" r="5" fill="#F2EFE6" opacity="0.5" />
      <circle cx="130" cy="55" r="4" fill="#3F3C37" opacity="0.3" />
      {/* Eye */}
      <circle cx="155" cy="58" r="4" fill="#3F3C37" />
      <circle cx="156" cy="57" r="1.5" fill="#F2EFE6" />
      {/* Whiskers */}
      <path d="M168 58 Q180 50, 185 48" stroke="#C9A574" strokeWidth="0.8" fill="none" opacity="0.6" />
      <path d="M168 62 Q180 70, 185 72" stroke="#C9A574" strokeWidth="0.8" fill="none" opacity="0.6" />
    </svg>
  );
};
