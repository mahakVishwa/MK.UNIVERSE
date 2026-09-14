import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export interface AstronautCompanionProps {
  visible: boolean;
  reducedMotion?: boolean;
  onCompanionClick?: () => void;
  className?: string;
}

const base = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : '/').replace(/\/$/, '');
const LOTTIE_ASSET_URL = `${base}/assets/characters/Astronaut%20Illustration.lottie`;

/**
 * AstronautCompanion:
 * Modular, reusable cosmic companion component for MK.UNIVERSE.
 * Renders the Lottie astronaut animation in a fixed, stable center-left position.
 *
 * Features:
 * - Subtle drifting entrance from below (gentle fade-in + slight upward settle)
 * - Once settled, locked to its position with very subtle zero-g idle breathing float
 * - Zero cards, zero borders, zero HUD, zero debug labels
 * - Sits strictly to the left of the dialogue bubble without overlapping
 * - Responsive sizing across mobile and desktop
 * - Respects prefers-reduced-motion
 */
export const AstronautCompanion: React.FC<AstronautCompanionProps> = ({
  visible,
  reducedMotion = false,
  onCompanionClick,
  className = '',
}) => {
  if (!visible) return null;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className} ${
        reducedMotion ? 'opacity-100' : 'animate-companion-entrance'
      }`}
    >
      {/* Inner container applying the subtle zero-g idle breathing float */}
      <div
        onClick={onCompanionClick}
        className={`pointer-events-auto relative flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
          reducedMotion ? '' : 'animate-subtle-float'
        }`}
        role="img"
        aria-label="Astronaut companion"
      >
        {/* Responsive Lottie Astronaut Container (No borders, no cards, no HUD) */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 flex items-center justify-center drop-shadow-[0_12px_32px_rgba(0,0,0,0.7)]">
          <DotLottieReact
            src={LOTTIE_ASSET_URL}
            loop={!reducedMotion}
            autoplay={true}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default AstronautCompanion;
