import React, { useState, useEffect } from 'react';

interface CosmicCompanionProps {
  visible: boolean;
  reducedMotion?: boolean;
  onCompanionClick?: () => void;
  className?: string;
}

/**
 * CosmicCompanion: A whimsical, handcrafted 2D celestial wanderer.
 * Represents a curious, warm starlight creature that inhabits MK.UNIVERSE.
 * Features:
 * - Expressive starlight eyes with natural blinking
 * - Soft hooded mantle with a golden star clasp and tiny celestial satchel
 * - Gentle floating & breathing micro-animations
 * - Responsive sizing and reduced-motion safeguards
 */
export const CosmicCompanion: React.FC<CosmicCompanionProps> = ({
  visible,
  reducedMotion = false,
  onCompanionClick,
  className = '',
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural periodic blinking loop
  useEffect(() => {
    if (reducedMotion) return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 4200);

    return () => clearInterval(blinkInterval);
  }, [reducedMotion]);

  if (!visible) return null;

  return (
    <div
      onClick={onCompanionClick}
      className={`pointer-events-auto relative inline-flex items-center justify-center select-none ${className} ${
        reducedMotion ? '' : 'animate-float'
      }`}
      style={{
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
      role="img"
      aria-label="Cosmic Wanderer companion"
    >
      {/* Soft Ambient Starlight Aura */}
      <div className="absolute -inset-3 rounded-full bg-amber-200/5 blur-xl pointer-events-none" />

      {/* Handcrafted SVG Vector Illustration of the Celestial Wanderer */}
      <svg
        viewBox="0 0 120 140"
        className="h-28 w-24 sm:h-36 sm:w-32 md:h-40 md:w-36 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cloak Outer Gradient */}
          <linearGradient id="mantleGrad" x1="60" y1="25" x2="60" y2="125" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3d374d" />
            <stop offset="60%" stopColor="#242131" />
            <stop offset="100%" stopColor="#171622" />
          </linearGradient>

          {/* Hood Inner Shadow */}
          <radialGradient id="hoodInner" cx="60" cy="56" r="32" gradientUnits="userSpaceOnUse">
            <stop offset="40%" stopColor="#08080f" />
            <stop offset="100%" stopColor="#1a1824" />
          </radialGradient>

          {/* Eye Starlight Glow */}
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f3ebdd" />
            <stop offset="100%" stopColor="#c9b78f" />
          </radialGradient>

          {/* Golden Star Clasp */}
          <linearGradient id="goldClasp" x1="55" y1="74" x2="65" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#c9b78f" />
          </linearGradient>

          {/* Satchel Starlight Glow */}
          <radialGradient id="satchelLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#fde68a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#c9b78f" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Faint Comet Tail / Ghostly Stardust Feet */}
        <path
          d="M48 116 C44 128 50 136 60 134 C70 136 76 128 72 116 Z"
          fill="#312c3f"
          opacity="0.6"
        />
        <circle cx="60" cy="132" r="3" fill="#c9b78f" opacity="0.4" />
        <circle cx="52" cy="128" r="1.5" fill="#f3ebdd" opacity="0.3" />
        <circle cx="67" cy="129" r="2" fill="#f3ebdd" opacity="0.35" />

        {/* Outer Traveling Mantle / Cloak */}
        <path
          d="M60 22 C34 22 22 45 25 76 C27 96 34 118 46 122 C56 125 64 125 74 122 C86 118 93 96 95 76 C98 45 86 22 60 22 Z"
          fill="url(#mantleGrad)"
          stroke="#423b53"
          strokeWidth="1.2"
        />

        {/* Cloak Fold Line */}
        <path
          d="M60 84 Q52 102 46 120"
          stroke="#1b1827"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Little Traveling Satchel Strap & Pouch */}
        <path
          d="M42 68 Q58 84 76 96"
          stroke="#6f555e"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect
          x="70"
          y="90"
          width="14"
          height="12"
          rx="3"
          fill="#3d2f3c"
          stroke="#6f555e"
          strokeWidth="1.2"
        />
        {/* Soft Stardust Emitting from Satchel */}
        <circle cx="77" cy="96" r="6" fill="url(#satchelLight)" />
        <circle cx="77" cy="96" r="1.5" fill="#fff" />

        {/* Hood Opening: Mysterious Deep Space Shadow */}
        <ellipse
          cx="60"
          cy="58"
          rx="25"
          ry="23"
          fill="url(#hoodInner)"
        />

        {/* Hood Rim Highlight */}
        <path
          d="M36 62 C34 40 46 32 60 32 C74 32 86 40 84 62 C82 76 72 82 60 82 C48 82 38 76 36 62 Z"
          fill="none"
          stroke="#55485a"
          strokeWidth="1.2"
        />

        {/* Golden Star Clasp at Neck */}
        <g transform="translate(60, 78)">
          <path
            d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z"
            fill="url(#goldClasp)"
          />
          <circle cx="0" cy="0" r="1.2" fill="#fff" />
        </g>

        {/* Expressive Luminous Starlight Eyes */}
        <g
          style={{
            transformOrigin: '60px 58px',
            transform: isBlinking ? 'scaleY(0.12)' : 'scaleY(1)',
            transition: 'transform 0.12s ease-in-out',
          }}
        >
          {/* Left Eye */}
          <ellipse
            cx="50"
            cy="58"
            rx="5.5"
            ry="7.5"
            fill="url(#eyeGlow)"
          />
          <circle cx="51.5" cy="56" r="2.2" fill="#ffffff" />
          <circle cx="48.5" cy="61" r="1" fill="#ffffff" opacity="0.8" />

          {/* Right Eye */}
          <ellipse
            cx="70"
            cy="58"
            rx="5.5"
            ry="7.5"
            fill="url(#eyeGlow)"
          />
          <circle cx="71.5" cy="56" r="2.2" fill="#ffffff" />
          <circle cx="68.5" cy="61" r="1" fill="#ffffff" opacity="0.8" />
        </g>

        {/* Tiny Wandering Celestial Dust Particles */}
        <circle cx="30" cy="40" r="1" fill="#f3ebdd" opacity="0.5" className={reducedMotion ? '' : 'animate-pulse'} />
        <circle cx="92" cy="48" r="1.5" fill="#c9b78f" opacity="0.4" className={reducedMotion ? '' : 'animate-pulse'} />
        <circle cx="86" cy="112" r="1" fill="#f3ebdd" opacity="0.3" />
      </svg>
    </div>
  );
};
