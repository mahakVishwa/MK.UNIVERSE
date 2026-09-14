import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Destination } from '../../types/navigation';
import { PandaCompanion } from '../guide/PandaCompanion';
import { useCoreStarState } from '../canvas/corestar/coreStarState';
import { VISIBLE_DESTINATIONS } from '../../data/destinations';

interface CoreStarWorldProps {
  destination: Destination | null;
  onReturnToMap: () => void;
  onSelectDestination?: (dest: Destination) => void;
  reducedMotion?: boolean;
}

/**
 * CoreStarWorld: The Core Star / About destination for MK.UNIVERSE.
 *
 * User Specifications Addressed:
 * 1. Identity Tag: High-contrast uppercase name at top-left outside of the Sun, plus bold dark orangish name inside Sun.
 * 2. Horizontally Scattered Orbits: Celestial objects spread across the entire horizontal width of the screen.
 * 3. Focused Interaction: When an object is clicked, ONLY the background dims. The clicked object remains in brilliant focus, and the companion dims with the background.
 * 4. Skills Option: When SKILLS is clicked, companion floats up to center and speaks its witty line, with clear options to either proceed to the skills wormhole or stay in the star system.
 */
export const CoreStarWorld: React.FC<CoreStarWorldProps> = ({
  onReturnToMap,
  onSelectDestination,
  reducedMotion = false,
}) => {
  const [selectedBodyId, setSelectedBodyId] = useCoreStarState();

  // Astronaut companion witty dialogue for Skills transition
  const [speechText, setSpeechText] = useState<string | null>(null);
  const [displayedSpeechLength, setDisplayedSpeechLength] = useState<number>(0);
  const [isSpeechTyping, setIsSpeechTyping] = useState<boolean>(false);

  const speechTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Trigger companion upward float & witty dialogue when SKILLS is clicked
  useEffect(() => {
    if (selectedBodyId === 'skills') {
      const wittyLine = "Okay, enough about the creator...\nlet's see what she actually works with.";
      setSpeechText(wittyLine);

      if (reducedMotion) {
        setDisplayedSpeechLength(wittyLine.length);
        setIsSpeechTyping(false);
        return;
      }

      setDisplayedSpeechLength(0);
      setIsSpeechTyping(true);

      let current = 0;
      speechTimerRef.current = setInterval(() => {
        current += 1;
        setDisplayedSpeechLength(current);

        if (current >= wittyLine.length) {
          if (speechTimerRef.current) clearInterval(speechTimerRef.current);
          setIsSpeechTyping(false);
        }
      }, 30);
    } else {
      setSpeechText(null);
      if (speechTimerRef.current) clearInterval(speechTimerRef.current);
    }

    return () => {
      if (speechTimerRef.current) clearInterval(speechTimerRef.current);
    };
  }, [selectedBodyId, reducedMotion]);

  // Proceed to Skills destination via Phase 4 wormhole
  const handleProceedToSkills = useCallback(() => {
    const skillsDest = VISIBLE_DESTINATIONS.find((d) => d.id === 'skills');
    if (skillsDest && onSelectDestination) {
      onSelectDestination(skillsDest);
    }
  }, [onSelectDestination]);

  // Cancel and stay in the Core Star system
  const handleStayHere = useCallback(() => {
    setSelectedBodyId(null);
  }, [setSelectedBodyId]);

  const hasActiveContent =
    selectedBodyId !== null &&
    selectedBodyId !== 'skills' &&
    ['education', 'interests', 'experience', 'orbit'].includes(selectedBodyId);

  const isSkillsActive = selectedBodyId === 'skills';

  return (
    <div
      role="region"
      aria-label="The Core Star - About Mahak Vishwakarma"
      className="pointer-events-none absolute inset-0 z-20 select-none overflow-hidden text-[#f3ebdd]"
    >
      {/* ============================================================ */}
      {/* 1. TOP-LEFT CELESTIAL IDENTITY (Always clearly readable)     */}
      {/* ============================================================ */}
      <div className="fixed top-7 left-6 sm:top-8 sm:left-10 pointer-events-auto z-20">
        <span className="font-mono text-[9.5px] sm:text-[10.5px] tracking-[0.38em] text-[#e87a30] uppercase block">
          THE CORE STAR · ABOUT
        </span>
        <h1 className="font-serif text-lg sm:text-2xl md:text-3xl tracking-[0.22em] text-[#f3ebdd] uppercase font-medium mt-0.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          MAHAK VISHWAKARMA
        </h1>
      </div>

      {/* ============================================================ */}
      {/* 2. COMPANION ASTRONAUT                                       */}
      {/* Parked in bottom-left corner; dims when an object is clicked; */}
      {/* Floats upward to center when SKILLS is clicked               */}
      {/* ============================================================ */}
      <div
        className={`fixed z-30 transition-all duration-700 ease-out pointer-events-none ${
          isSkillsActive
            ? 'bottom-28 sm:bottom-36 left-8 sm:left-24 translate-x-4 sm:translate-x-12 scale-110 sm:scale-125'
            : hasActiveContent
            ? 'bottom-6 left-6 sm:bottom-8 sm:left-8 scale-85 opacity-20 grayscale pointer-events-none'
            : 'bottom-6 left-6 sm:bottom-8 sm:left-8 scale-85 sm:scale-95 opacity-100 pointer-events-auto'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
          {/* Astronaut Illustration */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 pointer-events-auto">
            <PandaCompanion visible={true} reducedMotion={reducedMotion} />
          </div>

          {/* Speech Bubble with Option Buttons when SKILLS is clicked */}
          {speechText && (
            <div
              role="status"
              aria-live="polite"
              className="pointer-events-auto relative w-[290px] sm:w-[330px] text-left animate-in fade-in zoom-in-95 duration-400"
            >
              <div className="relative rounded-2xl rounded-tl-xs border border-[#f3ebdd]/20 bg-[#101018]/95 px-4 py-3.5 sm:px-5 sm:py-4 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
                <div className="absolute -left-2 top-4 sm:top-5 h-2.5 w-2.5 sm:h-3 sm:w-3 rotate-45 border-l border-b border-[#f3ebdd]/20 bg-[#101018]" />
                
                {/* Witty Dialogue Line */}
                <p className="font-amarante text-lg sm:text-xl text-[#f3ebdd] leading-relaxed tracking-wide whitespace-pre-line">
                  “{speechText.slice(0, displayedSpeechLength)}”
                  {isSpeechTyping && (
                    <span className="inline-block w-1.5 h-3.5 sm:h-4 ml-1 bg-[#c9b78f]/80 animate-pulse align-middle" />
                  )}
                </p>

                {/* Option Buttons: User chooses before enabling wormhole transition */}
                <div className="mt-3.5 flex items-center gap-2.5 pt-2.5 border-t border-[#f3ebdd]/15">
                  <button
                    type="button"
                    onClick={handleProceedToSkills}
                    className="px-3.5 py-1.5 rounded-full bg-[#c9b78f]/25 hover:bg-[#c9b78f]/40 border border-[#c9b78f]/60 hover:border-[#f3ebdd] text-xs font-amarante text-[#f3ebdd] hover:text-white tracking-wider transition-all duration-200 hover:scale-105"
                  >
                    travel to skills ✦
                  </button>
                  <button
                    type="button"
                    onClick={handleStayHere}
                    className="px-3 py-1.5 rounded-full bg-[#101018]/60 hover:bg-[#181624] border border-[#f3ebdd]/15 text-xs font-serif text-[#d9d2c5]/70 hover:text-[#f3ebdd] transition-all duration-200"
                  >
                    stay in star system
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. FOCUSED CELESTIAL CONTENT: ALONGSIDE ON THE RIGHT         */}
      {/* Displayed in an elegant glassmorphic box                     */}
      {/* ============================================================ */}
      {hasActiveContent && (
        <div
          onClick={() => setSelectedBodyId(null)}
          className="absolute inset-0 flex items-center justify-end px-6 sm:px-12 md:px-16 lg:px-24 z-25 pointer-events-auto cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md md:max-w-lg rounded-2xl border border-[#c9b78f]/25 bg-[#101018]/85 p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-left animate-in fade-in zoom-in-95 duration-400 cursor-default"
          >
            {/* Return Action */}
            <button
              type="button"
              onClick={() => setSelectedBodyId(null)}
              className="group mb-4 inline-flex items-center gap-2 font-serif text-xs text-[#c9b78f]/80 hover:text-[#f3ebdd] transition-colors focus:outline-none"
            >
              <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
              <span className="tracking-[0.2em] uppercase font-amarante text-sm">
                back to star system
              </span>
            </button>

            {/* 1. EDUCATION */}
            {selectedBodyId === 'education' && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl text-[#f3ebdd] tracking-[0.2em] uppercase font-normal">
                  EDUCATION
                </h2>

                <div className="space-y-1 font-serif text-sm sm:text-base text-[#d9d2c5]/90">
                  <p className="text-[#f3ebdd] font-medium">Information Technology</p>
                  <p className="text-[#c9b78f]/90">
                    International Institute of Professional Studies (DAVV), Indore
                  </p>
                  <p className="font-mono text-xs text-[#c9b78f]/70 uppercase tracking-widest pt-1">
                    Expected 2029
                  </p>
                </div>

                <div className="pt-2 space-y-1.5 font-serif text-xs sm:text-sm text-[#d9d2c5]/80 border-t border-[#f3ebdd]/10">
                  <p>CGPA — 9.54</p>
                  <p>Higher Secondary — 95.4% (2024)</p>
                  <p>Secondary — 96.4% (2022)</p>
                </div>
              </div>
            )}

            {/* 2. INTERESTS */}
            {selectedBodyId === 'interests' && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl text-[#f3ebdd] tracking-[0.2em] uppercase font-normal">
                  INTERESTS
                </h2>

                <div className="space-y-2 font-serif text-sm sm:text-base text-[#d9d2c5]/90">
                  <p>Data Analytics</p>
                  <p>AI / Machine Learning</p>
                  <p>Web Development</p>
                </div>
              </div>
            )}

            {/* 3. EXPERIENCE */}
            {selectedBodyId === 'experience' && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl text-[#f3ebdd] tracking-[0.2em] uppercase font-normal">
                  EXPERIENCE
                </h2>

                <div className="space-y-1.5 font-serif text-sm sm:text-base text-[#d9d2c5]/90">
                  <p className="text-[#f3ebdd] font-medium">Frontend Developer Intern</p>
                  <p className="text-[#c9b78f]/90">Claiminn</p>
                  <p className="font-mono text-xs text-[#c9b78f]/70 tracking-wider pt-1">
                    3-month Internship · Remote
                  </p>
                </div>
              </div>
            )}

            {/* 4. CURRENT ORBIT */}
            {selectedBodyId === 'orbit' && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl text-[#f3ebdd] tracking-[0.2em] uppercase font-normal">
                  CURRENT ORBIT
                </h2>

                <div className="space-y-2 font-serif text-sm sm:text-base text-[#d9d2c5]/90">
                  <p>Data Analytics</p>
                  <p>AI / Machine Learning</p>
                  <p>Web Development</p>
                </div>

                <div className="pt-2 space-y-1 border-t border-[#f3ebdd]/10">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[#c9b78f]/80">
                    Currently exploring:
                  </p>
                  <p className="font-serif text-xs sm:text-sm text-[#d9d2c5]/90 leading-relaxed">
                    Data Analysis · Python · Power BI · Machine Learning · React · JavaScript
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. RETURN TO STAR CHART (Bottom Right Corner)                */}
      {/* ============================================================ */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 pointer-events-auto z-20">
        {/* Return to Star Chart */}
        <button
          type="button"
          onClick={onReturnToMap}
          aria-label="Return to celestial star chart"
          className="group flex items-center gap-2.5 rounded-full border border-[#f3ebdd]/20 bg-[#101018]/80 px-5 sm:px-6 py-2 sm:py-2.5 backdrop-blur-md transition-all duration-300 hover:border-[#c9b78f]/60 hover:bg-[#161624] hover:scale-105 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#f3ebdd] shadow-[0_8px_25px_rgba(0,0,0,0.6)]"
        >
          <span className="font-serif text-sm text-[#c9b78f] group-hover:rotate-45 transition-transform duration-300">
            ✦
          </span>
          <span className="font-amarante text-base sm:text-lg text-[#f3ebdd] group-hover:text-[#ffffff] tracking-wide">
            return to star chart
          </span>
        </button>
      </div>
    </div>
  );
};

export default CoreStarWorld;
