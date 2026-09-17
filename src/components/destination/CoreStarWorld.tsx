import React, { useEffect } from 'react';
import { Destination } from '../../types/navigation';
import { ParallaxEnvironment25D } from './corestar/ParallaxEnvironment25D';
import { CORE_STAR_LAYERS } from './corestar/sceneConfig';

interface CoreStarWorldProps {
  destination?: Destination | null;
  onReturnToMap?: () => void;
  onSelectDestination?: (dest: Destination) => void;
  reducedMotion?: boolean;
}

/**
 * CoreStarWorld:
 * Visual 2.5D Parallax Environment for THE CORE STAR section of MK.UNIVERSE.
 *
 * Implements exclusively the multiplane 2.5D visual environment using the exact
 * 7 provided PNG assets and their defined physical depth planes.
 *
 * Per specification:
 * - NO text or placeholder typography
 * - NO labels or hover cards
 * - NO navigation buttons or UI overlays
 * - NO interactive information behavior
 * - Pure visual 2.5D cinematic multiplane depth environment
 */
export const CoreStarWorld: React.FC<CoreStarWorldProps> = ({
  onReturnToMap,
  reducedMotion = false,
}) => {
  // Invisible keyboard navigation support: Escape allows returning to celestial star chart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        onReturnToMap?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onReturnToMap]);

  return (
    <div
      role="region"
      aria-label="The Core Star - 2.5D Cosmic Parallax Environment"
      className="fixed inset-0 z-20 select-none overflow-hidden bg-[#040508]"
    >
      <ParallaxEnvironment25D
        layers={CORE_STAR_LAYERS}
        reducedMotion={reducedMotion}
        className="w-full h-full"
      />
    </div>
  );
};

export default CoreStarWorld;
