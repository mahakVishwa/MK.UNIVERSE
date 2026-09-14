import React from 'react';
import { Destination } from '../../types/navigation';

interface DestinationPlaceholderProps {
  destination: Destination | null;
  onReturnToMap: () => void;
}

/**
 * DestinationPlaceholder: Minimal placeholder environment showing the destination name.
 * Used to verify that the physical wormhole travel reached the intended destination.
 *
 * Example:
 * THE CORE STAR
 *
 * Provides an un-intrusive action to return to the star chart for testing.
 * No persistent navbar, no persistent HUD.
 */
export const DestinationPlaceholder: React.FC<DestinationPlaceholderProps> = ({
  destination,
  onReturnToMap,
}) => {
  if (!destination) {
    return null;
  }

  return (
    <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in zoom-in-95 duration-700 z-20">
      <div className="flex flex-col items-center max-w-xl">
        {/* Subtle Celestial Symbol & Destination Tag */}
        <div className="mb-4 flex items-center gap-2.5">
          <span className="text-xl text-[#c9b78f]" aria-hidden="true">
            {destination.symbol}
          </span>
          <span className="font-serif text-xs sm:text-sm tracking-[0.35em] text-[#c9b78f]/80 uppercase">
            {destination.label}
          </span>
        </div>

        {/* Destination Name in Uppercase Typography */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#f3ebdd] tracking-[0.18em] font-normal uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)] leading-tight">
          {destination.title}
        </h1>

        {/* Poetic description from star chart */}
        <p className="mt-4 sm:mt-6 font-serif text-sm sm:text-base text-[#d9d2c5]/75 italic leading-relaxed tracking-wide px-4 drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] max-w-md">
          “{destination.description}”
        </p>

        {/* Minimal return action for testing & navigation */}
        <div className="mt-10 sm:mt-14">
          <button
            type="button"
            onClick={onReturnToMap}
            aria-label="Return to celestial star chart"
            className="group flex items-center gap-2.5 rounded-full border border-[#f3ebdd]/20 bg-[#101018]/80 px-6 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-[#c9b78f]/60 hover:bg-[#151522] hover:scale-105 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#f3ebdd] shadow-[0_8px_25px_rgba(0,0,0,0.5)]"
          >
            <span className="font-serif text-sm text-[#c9b78f] group-hover:rotate-45 transition-transform duration-300">
              ✦
            </span>
            <span className="font-amarante text-lg sm:text-xl text-[#f3ebdd] group-hover:text-[#ffffff] tracking-wide">
              return to star chart
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
