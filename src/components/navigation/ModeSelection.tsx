import React from 'react';
import { NavigationMode } from '../../types/navigation';

interface ModeSelectionProps {
  onSelectMode: (mode: NavigationMode) => void;
}

/**
 * ModeSelection: Floating celestial pathways in the open cosmos.
 * - No rectangular cards, no bordered panels, no buttons.
 * - Soft, handwritten choices arranged vertically:
 *     ✦ show me around
 *     ✦ i'll wander myself
 */
export const ModeSelection: React.FC<ModeSelectionProps> = ({
  onSelectMode,
}) => {
  return (
    <div
      role="region"
      aria-label="Choose your pathway"
      className="pointer-events-auto flex flex-col items-center sm:items-start gap-3 sm:gap-4 select-none animate-in fade-in zoom-in-95 duration-700"
    >
      {/* Choice 1: Guided Tour */}
      <button
        type="button"
        onClick={() => onSelectMode('guided')}
        className="group flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#f3ebdd] rounded-lg px-1.5 py-1 transition-all duration-300 hover:translate-x-1.5"
      >
        <span className="font-serif text-sm sm:text-base text-[#c9b78f] group-hover:scale-125 transition-transform">
          ✦
        </span>
        <span className="font-amarante text-base sm:text-lg md:text-xl text-[#f3ebdd]/85 group-hover:text-[#ffffff] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-wide">
          Show me around
        </span>
      </button>

      {/* Choice 2: Free Exploration */}
      <button
        type="button"
        onClick={() => onSelectMode('explore')}
        className="group flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#f3ebdd] rounded-lg px-1.5 py-1 transition-all duration-300 hover:translate-x-1.5"
      >
        <span className="font-serif text-sm sm:text-base text-[#c9b78f] group-hover:scale-125 transition-transform">
          ✦
        </span>
        <span className="font-amarante text-base sm:text-lg md:text-xl text-[#f3ebdd]/85 group-hover:text-[#ffffff] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-wide">
          I’ll wander myself
        </span>
      </button>
    </div>
  );
};
