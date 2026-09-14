import React from 'react';
import { Destination, DestinationId, InteractionPhase, NavigationMode } from '../../types/navigation';
import { PandaCompanion } from '../guide/PandaCompanion';
import { GuideDialogue } from '../guide/GuideDialogue';
import { HolographicMap } from '../navigation/HolographicMap';
import { ModeSelection } from '../navigation/ModeSelection';
import { DestinationPlaceholder } from '../destination/DestinationPlaceholder';
import { CoreStarWorld } from '../destination/CoreStarWorld';
import { TravelState } from '../../types/travel';

interface AppOverlayProps {
  reducedMotion: boolean;
  galaxyFormed: boolean;
  phase: InteractionPhase;
  dialogueStep: number;
  navigationMode: NavigationMode | null;
  selectedDestination: DestinationId | null;
  activeDestination?: Destination | null;
  travelState?: TravelState;
  onAdvanceDialogue: () => void;
  onStartGuide: () => void;
  onSelectMode: (mode: NavigationMode) => void;
  onSelectDestination: (dest: Destination) => void;
  onSetPhase: (phase: InteractionPhase) => void;
  onReturnToMap?: () => void;
}

/**
 * AppOverlay: Pure immersive cosmic presentation.
 * - Zero persistent navigation bars, zero status pills, zero developer labels
 * - Center-right zero-G Panda astronaut companion
 * - Natural automatic dialogue progression in handwritten font (Patrick Hand)
 * - Vertically arranged floating celestial pathways
 * - Unboxed celestial star chart floating directly over the galaxy
 * - Seamless physical wormhole departure folding and destination placeholder
 */
export const AppOverlay: React.FC<AppOverlayProps> = ({
  reducedMotion,
  galaxyFormed,
  phase,
  dialogueStep,
  navigationMode,
  selectedDestination,
  activeDestination = null,
  travelState,
  onAdvanceDialogue,
  onStartGuide,
  onSelectMode,
  onSelectDestination,
  onSetPhase,
  onReturnToMap = () => {},
}) => {
  const showHero = reducedMotion || galaxyFormed;
  const isTraveling = travelState?.isTraveling ?? false;
  const isMapFolding = isTraveling && travelState?.phase === 'departure';
  const isTravelingPastDeparture = isTraveling && travelState?.phase !== 'departure';

  const isMapOpen =
    !isTravelingPastDeparture &&
    phase !== 'destination' &&
    (isMapFolding || phase === 'map-reveal' || (phase === 'active' && navigationMode === 'explore'));

  const companionVisible =
    phase !== 'arrival' &&
    phase !== 'traveling' &&
    phase !== 'destination' &&
    !isMapOpen;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 select-none overflow-hidden text-[#f3ebdd]">
      {/* ============================================================ */}
      {/* 0. WORMHOLE EXIT FLASH WASH (Deceleration burst)             */}
      {/* ============================================================ */}
      {travelState && travelState.exitFlash > 0.01 && (
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-200"
          style={{
            opacity: travelState.exitFlash,
            background:
              'radial-gradient(circle at 50% 50%, rgba(243, 235, 221, 0.45) 0%, rgba(201, 183, 143, 0.20) 50%, transparent 80%)',
          }}
        />
      )}
      {/* ============================================================ */}
      {/* 1. WELCOME TITLE MOMENT (Only during arrival)                */}
      {/* ============================================================ */}
      {phase === 'arrival' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div
            className={`transition-all duration-1000 ease-out flex flex-col items-center ${
              showHero
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            {/* Monogram */}
            <div className="mb-4">
              <span className="font-serif text-sm tracking-[0.45em] text-[#c9b78f]/80 uppercase">
                Mahak Vishwakarma
              </span>
            </div>

            {/* Cinematic Film Title */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#f3ebdd] tracking-[0.2em] font-normal uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
              WELCOME, EXPLORER.
            </h1>

            {/* Poetic Subtitle */}
            <p className="mt-4 sm:mt-6 max-w-lg font-serif text-sm sm:text-base md:text-lg text-[#d9d2c5]/80 italic leading-relaxed tracking-wide px-4 drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
              You’ve entered my universe of code, ideas and experiments.
            </p>

            {/* Gentle Awakening Trigger */}
            <div className="mt-9 sm:mt-12 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={onStartGuide}
                className="group pointer-events-auto flex items-center gap-2 rounded-full px-6 py-2.5 font-amarante text-xl sm:text-2xl text-[#f3ebdd] transition-all duration-300 hover:scale-110 hover:text-[#ffffff] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#f3ebdd]"
              >
                <span className="text-base text-[#c9b78f] group-hover:rotate-45 transition-transform">✦</span>
                <span>wake companion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. COMPANION INTERACTION CONTAINER (STABLE ANCHOR)           */}
      {/* Pinned in center-left region. Character NEVER shifts.        */}
      {/* [ CHARACTER ]  →  [ DIALOGUE ]                               */}
      {/* ============================================================ */}
      {companionVisible && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-start pl-6 sm:pl-14 md:pl-20 lg:pl-28">
          {/* Stable horizontal flex row anchored from the left */}
          <div className="relative flex flex-row items-center gap-6 sm:gap-8">
            
            {/* 1. CHARACTER (Pinned on LEFT - fixed dimensions, NEVER shifts) */}
            <div className="shrink-0 w-36 sm:w-44 flex items-center justify-center">
              <PandaCompanion
                visible={true}
                reducedMotion={reducedMotion}
                onCompanionClick={phase === 'guide-intro' ? onAdvanceDialogue : undefined}
              />
            </div>

            {/* 2. DIALOGUE AREA (Always directly to the RIGHT of character) */}
            {/* Width expands rightward; NEVER pushes or shifts the character */}
            <div className="w-[280px] sm:w-[340px] md:w-[400px] max-w-md text-left z-20">
              
              {/* Automated Dialogue Steps with Typewriter Reveal */}
              {phase === 'guide-intro' && (
                <GuideDialogue
                  step={dialogueStep}
                  onAdvance={onAdvanceDialogue}
                  autoAdvance={!reducedMotion}
                  reducedMotion={reducedMotion}
                />
              )}

              {/* Mode Question & Floating Vertical Choices */}
              {phase === 'mode-select' && (
                <div className="flex flex-col items-start gap-4 animate-in fade-in duration-500">
                  {/* Speech Bubble with left-pointing tail */}
                  <div className="relative rounded-2xl rounded-tl-xs border border-[#f3ebdd]/15 bg-[#101018]/90 px-4 py-3 sm:px-5 sm:py-3.5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
                    <div className="absolute -left-2 top-4 sm:top-5 h-2.5 w-2.5 sm:h-3 sm:w-3 rotate-45 border-l border-b border-[#f3ebdd]/15 bg-[#101018]" />
                    <p className="font-amarante text-lg sm:text-xl md:text-[22px] text-[#f3ebdd] leading-relaxed tracking-wide min-h-[1.75em]">
                      “Want me to show you around?”
                    </p>
                  </div>

                  {/* Vertically Arranged Floating Pathways */}
                  <div className="mt-2 pl-2">
                    <ModeSelection onSelectMode={onSelectMode} />
                  </div>
                </div>
              )}

              {/* Guided Mode Response */}
              {phase === 'active' && navigationMode === 'guided' && (
                <div className="flex flex-col items-start gap-3.5 max-w-sm text-left animate-in fade-in duration-500">
                  <div className="relative rounded-2xl rounded-tl-xs border border-[#f3ebdd]/15 bg-[#101018]/90 px-4 py-3 sm:px-5 sm:py-3.5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
                    <div className="absolute -left-2 top-4 sm:top-5 h-2.5 w-2.5 sm:h-3 sm:w-3 rotate-45 border-l border-b border-[#f3ebdd]/15 bg-[#101018]" />
                    <p className="font-amarante text-lg sm:text-xl md:text-[22px] text-[#f3ebdd] leading-relaxed tracking-wide min-h-[1.75em]">
                      “Okay! Stay close... I know exactly where we should start.”
                    </p>
                  </div>

                  {/* Gentle Option to Peek at the Star Chart */}
                  <button
                    type="button"
                    onClick={() => onSetPhase('map-reveal')}
                    className="pointer-events-auto font-amarante text-lg text-[#c9b78f] hover:text-[#f3ebdd] hover:translate-x-1 transition-all pl-2"
                  >
                    ✦ peek at the star chart
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. UNBOXED CELESTIAL STAR CHART LAYER (Unfolded cream paper) */}
      {/* Strictly separated from dialogue - no speech bubbles overlap */}
      {/* ============================================================ */}
      {isMapOpen && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-8 z-15">
          <HolographicMap
            selectedDestination={selectedDestination}
            onSelectDestination={onSelectDestination}
            isFolding={isMapFolding}
            disabled={isTraveling}
          />

          {/* Gentle return action when star chart is peeked during guided tour */}
          {phase === 'map-reveal' && !isMapFolding && (
            <button
              type="button"
              onClick={() => onSetPhase('active')}
              className="pointer-events-auto mt-4 font-amarante text-lg sm:text-xl text-[#c9b78f] hover:text-[#f3ebdd] transition-all flex items-center gap-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              <span>✦</span>
              <span>fold star chart</span>
            </button>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. DESTINATION ENVIRONMENT                                   */}
      {/* Real Core Star About world or placeholder for other worlds    */}
      {/* ============================================================ */}
      {phase === 'destination' && (
        activeDestination?.id === 'about' ? (
          <CoreStarWorld
            destination={activeDestination}
            onReturnToMap={onReturnToMap}
            onSelectDestination={onSelectDestination}
            reducedMotion={reducedMotion}
          />
        ) : (
          <DestinationPlaceholder
            destination={activeDestination}
            onReturnToMap={onReturnToMap}
          />
        )
      )}
    </div>
  );
};
