import React from 'react';

interface IllustratedSunProps {
  parallaxX: number;
  parallaxY: number;
  isDimmed: boolean;
  reducedMotion?: boolean;
}

/**
 * IllustratedSun: The central faceted Sun representing MAHAK.
 * Built using the exact low-poly / faceted painterly cosmic art style of the reference image.
 * Features:
 * - Central faceted blazing solar sphere with crystalline solar flares and plasma shards
 * - Layered animated breathing warmth & corona radiance
 * - "MAHAK VISHWAKARMA" naturally integrated into the molten faceted core,
 *   subtly pulsating with the star's light and heat.
 */
export const IllustratedSun: React.FC<IllustratedSunProps> = ({
  parallaxX,
  parallaxY,
  isDimmed,
  reducedMotion = false,
}) => {
  const pxOffset = parallaxX * 22;
  const pyOffset = parallaxY * 15;

  return (
    <div
      className="pointer-events-none absolute z-15 select-none transition-all duration-700 ease-out"
      style={{
        left: '50%',
        top: '46%',
        transform: `translate(-50%, -50%) translate(${pxOffset}px, ${pyOffset}px) scale(${
          isDimmed ? 0.90 : 1.0
        })`,
        opacity: isDimmed ? 0.14 : 1.0,
      }}
    >
      <div className="relative flex items-center justify-center w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px]">
        {/* Layer 1: Ethereal Atmospheric Corona Halo (Breathing golden-amber glow) */}
        <div
          className={`absolute -inset-10 sm:-inset-16 rounded-full transition-opacity duration-1000 ${
            reducedMotion ? '' : 'animate-pulse'
          }`}
          style={{
            background:
              'radial-gradient(circle at center, rgba(251, 191, 36, 0.48) 0%, rgba(245, 158, 11, 0.24) 48%, rgba(194, 65, 12, 0.08) 68%, transparent 80%)',
            filter: 'blur(32px)',
            animationDuration: '5.5s',
          }}
        />

        {/* Layer 2: Swirling Crystalline Solar Flares (Gentle slow counter-rotation) */}
        <div
          className="absolute inset-0 select-none pointer-events-none"
          style={{
            backgroundImage: 'url(/assets/corestar/layers/sun.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'drop-shadow(0 0 25px rgba(245, 158, 11, 0.65)) brightness(1.15)',
            transform: 'scale(1.04)',
            animation: reducedMotion ? 'none' : 'spin 110s linear infinite reverse',
            opacity: 0.85,
          }}
        />

        {/* Layer 3: Solid Faceted Solar Core (Exact reference artwork) */}
        <div
          className="relative w-full h-full select-none"
          style={{
            backgroundImage: 'url(/assets/corestar/layers/sun.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'drop-shadow(0 0 35px rgba(251, 191, 36, 0.85)) drop-shadow(0 0 70px rgba(245, 158, 11, 0.5))',
          }}
        />

        {/* Layer 4: "MAHAK VISHWAKARMA" Integrated into the Faceted Core */}
        <div
          className="absolute z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
          style={{
            animation: reducedMotion ? 'none' : 'solarPulse 5s ease-in-out infinite',
          }}
        >
          {/* Subtle constellation indicator */}
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.45em] text-[#fffbeb] drop-shadow-[0_0_10px_rgba(255,235,160,0.95)] uppercase mb-1 opacity-90">
            ✦ CREATOR CORE ✦
          </span>

          {/* Integrated Creator Name: Radiant molten solar calligraphy */}
          <h1
            className="font-serif text-sm sm:text-2xl md:text-3xl lg:text-[32px] tracking-[0.22em] sm:tracking-[0.26em] font-medium uppercase select-none"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #fff2cf 35%, #ffd276 70%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter:
                'drop-shadow(0 0 14px rgba(255, 215, 60, 0.95)) drop-shadow(0 0 28px rgba(245, 140, 20, 0.8)) drop-shadow(0 2px 4px rgba(0,0,0,0.95))',
            }}
          >
            MAHAK VISHWAKARMA
          </h1>

          {/* Golden solar radiance bar */}
          <div
            className="mt-1.5 h-[1.5px] w-24 sm:w-32 rounded-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,245,220,0.95) 50%, transparent)',
              boxShadow: '0 0 10px rgba(255,215,60,0.95)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default IllustratedSun;
