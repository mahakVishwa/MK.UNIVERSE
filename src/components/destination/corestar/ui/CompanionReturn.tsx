import React, { useState } from 'react';
import { Destination } from '../../../../types/navigation';
import { VISIBLE_DESTINATIONS } from '../../../../data/destinations';
import { PandaCompanion } from '../../../guide/PandaCompanion';
import { CORE_STAR_COMPLETION_DIALOGUE } from '../contentData';

interface CompanionReturnProps {
  reducedMotion?: boolean;
  dialogueText?: string;
  onReturnToMap?: () => void;
  onSelectDestination?: (dest: Destination) => void;
  onDismiss?: () => void;
  className?: string;
}

/**
 * CompanionReturn:
 * Organic narrative transition triggered automatically after all three Core Star
 * sections (Education, Interests, Experience) have been explored.
 *
 * Preserves the exact existing Astronaut/Panda companion character, Lottie animation,
 * zero-g float, and intimate speech bubble visual language.
 */
export const CompanionReturn: React.FC<CompanionReturnProps> = ({
  reducedMotion = false,
  dialogueText = CORE_STAR_COMPLETION_DIALOGUE,
  onReturnToMap,
  onSelectDestination,
  onDismiss,
  className = '',
}) => {
  // Option to minimize speech bubble to view the unencumbered universe
  const [bubbleVisible, setBubbleVisible] = useState(true);

  // Next destination in the cosmic journey (Planetary System / Skills)
  const nextDestination =
    VISIBLE_DESTINATIONS.find((d) => d.id === 'skills') || VISIBLE_DESTINATIONS[1];

  return (
    <div
      role="region"
      aria-label="Cosmic companion return"
      className={`pointer-events-none absolute inset-0 z-40 flex items-start justify-start pt-[12vh] sm:pt-[14vh] pl-6 sm:pl-10 md:pl-14 lg:pl-16 select-none ${className}`}
    >
      {/* Horizontal row anchored from the left: [ CHARACTER ] -> [ DIALOGUE & NAVIGATION ] */}
      <div
        className={`relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 ${
          reducedMotion ? 'opacity-100' : 'animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out'
        }`}
      >
        {/* 1. CHARACTER (Pinned left - authentic zero-G floating astronaut) */}
        <div className="shrink-0 w-32 sm:w-40 md:w-44 flex items-center justify-center">
          <PandaCompanion
            visible={true}
            reducedMotion={reducedMotion}
            onCompanionClick={() => setBubbleVisible((prev) => !prev)}
          />
        </div>

        {/* 2. SPEECH BUBBLE & NAVIGATION CHOICES */}
        {bubbleVisible && (
          <div className="pointer-events-auto w-[290px] sm:w-[360px] md:w-[410px] max-w-md text-left z-20 space-y-3.5 animate-in fade-in duration-400">
            {/* Organic Speech Bubble */}
            <div className="relative rounded-2xl rounded-tl-xs border border-[#f3ebdd]/20 bg-[#101018]/92 px-4 py-3.5 sm:px-5 sm:py-4 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.75)]">
              {/* Left-pointing bubble tail */}
              <div className="hidden sm:block absolute -left-2 top-5 h-3 w-3 rotate-45 border-l border-b border-[#f3ebdd]/20 bg-[#101018]" />

              {/* Intimate Companion Voice in Amarante */}
              <p className="font-amarante text-lg sm:text-xl md:text-[22px] text-[#f3ebdd] leading-relaxed tracking-wide">
                “{dialogueText}”
              </p>
            </div>

            {/* Navigation Options */}
            <div className="space-y-2 pl-1">
              {/* Primary Option: Journey outward to the Planetary System (Skills) */}
              {nextDestination && (
                <button
                  type="button"
                  onClick={() => onSelectDestination?.(nextDestination)}
                  className="group w-full flex items-center justify-between p-3 sm:py-3 sm:px-4 rounded-xl border border-[#c9b78f]/30 bg-[#141525]/90 hover:bg-[#1d1e34] hover:border-[#c9b78f]/70 transition-all duration-300 shadow-[0_6px_24px_rgba(0,0,0,0.6)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-[#c9b78f] group-hover:rotate-45 transition-transform duration-300">
                      {nextDestination.symbol}
                    </span>
                    <div className="text-left">
                      <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-[#c9b78f]/75">
                        Next Destination
                      </span>
                      <span className="font-serif text-sm sm:text-base text-[#f3ebdd] font-medium tracking-wide">
                        {nextDestination.title} ({nextDestination.label})
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#c9b78f] group-hover:translate-x-1 transition-transform">
                    ✦ &gt;
                  </span>
                </button>
              )}

              {/* Secondary Option: Unfold Celestial Star Chart */}
              <button
                type="button"
                onClick={onReturnToMap}
                className="group w-full flex items-center justify-between py-2.5 px-4 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] hover:border-white/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm text-[#c9b78f] group-hover:rotate-45 transition-transform duration-300">
                    ✦
                  </span>
                  <span className="font-amarante text-base sm:text-lg text-[#d9d2c5] group-hover:text-white tracking-wide">
                    unfold celestial star chart
                  </span>
                </div>
                <span className="font-mono text-xs text-[#d9d2c5]/60 group-hover:translate-x-0.5 transition-transform">
                  &gt;
                </span>
              </button>

              {/* Tertiary Option: Stay and wander freely */}
              <div className="pt-1 flex items-center justify-between px-2 text-[11px] text-[#d9d2c5]/60 font-mono">
                <span>✦ Core Star Archive Explored</span>
                <button
                  type="button"
                  onClick={() => {
                    setBubbleVisible(false);
                    onDismiss?.();
                  }}
                  className="hover:text-[#f3ebdd] underline decoration-white/20 hover:decoration-white/60 transition-colors cursor-pointer"
                >
                  wander freely
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanionReturn;
