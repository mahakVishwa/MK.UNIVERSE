import React, { useEffect, useState, useRef, useCallback } from 'react';
import { GUIDE_DIALOGUES } from '../../data/destinations';

interface GuideDialogueProps {
  step: number;
  onAdvance: () => void;
  autoAdvance?: boolean;
  reducedMotion?: boolean;
}

/**
 * GuideDialogue: Intimate, organic speech bubble with typewriter text reveal.
 * - Starts typing ~40ms per character
 * - Holds for ~2.2s after typing finishes before automatically advancing
 * - Intimate, reduced font size (20-22px desktop)
 * - Tail points left toward the stable companion
 */
export const GuideDialogue: React.FC<GuideDialogueProps> = ({
  step,
  onAdvance,
  autoAdvance = true,
  reducedMotion = false,
}) => {
  const currentDialogue = GUIDE_DIALOGUES[step] || GUIDE_DIALOGUES[0];
  const fullText = currentDialogue.text;

  const [displayedLength, setDisplayedLength] = useState<number>(reducedMotion ? fullText.length : 0);
  const [isTyping, setIsTyping] = useState<boolean>(!reducedMotion);

  const typingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);

    if (reducedMotion) {
      setDisplayedLength(fullText.length);
      setIsTyping(false);
      if (autoAdvance) {
        advanceTimerRef.current = setTimeout(() => {
          onAdvance();
        }, 2200);
      }
      return;
    }

    setDisplayedLength(0);
    setIsTyping(true);

    // Initial delay: step 0 waits 800ms for companion drift-in; subsequent steps start after 120ms
    const startDelay = step === 0 ? 800 : 120;

    const startTimer = setTimeout(() => {
      let currentLength = 0;
      typingTimerRef.current = setInterval(() => {
        currentLength += 1;
        setDisplayedLength(currentLength);

        if (currentLength >= fullText.length) {
          if (typingTimerRef.current) clearInterval(typingTimerRef.current);
          setIsTyping(false);

          // Sentence finished typing: hold for 2.2 seconds before advancing to next sentence
          if (autoAdvance) {
            advanceTimerRef.current = setTimeout(() => {
              onAdvance();
            }, 2200);
          }
        }
      }, 40);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, [step, fullText, autoAdvance, onAdvance, reducedMotion]);

  // Click or Space/Enter to either fast-forward typing or advance immediately
  const handleUserTrigger = useCallback(() => {
    if (isTyping) {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setDisplayedLength(fullText.length);
      setIsTyping(false);
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      if (autoAdvance) {
        advanceTimerRef.current = setTimeout(() => {
          onAdvance();
        }, 2200);
      }
    } else {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      onAdvance();
    }
  }, [isTyping, fullText.length, autoAdvance, onAdvance]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleUserTrigger();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUserTrigger]);

  const displayedText = fullText.slice(0, displayedLength);

  return (
    <div
      role="region"
      aria-label="Companion speech"
      aria-live="polite"
      onClick={handleUserTrigger}
      className="pointer-events-auto relative cursor-pointer select-none transition-all duration-300"
    >
      {/* Speech Bubble Container */}
      <div className="relative rounded-2xl rounded-tl-xs border border-[#f3ebdd]/15 bg-[#101018]/90 px-4 py-3 sm:px-5 sm:py-3.5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]">
        {/* Tail pointing toward the companion on the left */}
        <div className="absolute -left-2 top-4 sm:top-5 h-2.5 w-2.5 sm:h-3 sm:w-3 rotate-45 border-l border-b border-[#f3ebdd]/15 bg-[#101018]" />

        {/* Intimate companion voice in Amarante, font size ~20-22px desktop */}
        <p className="font-amarante text-lg sm:text-xl md:text-[22px] text-[#f3ebdd] leading-relaxed tracking-wide min-h-[1.75em]">
          “{displayedText}”
          {isTyping && (
            <span className="inline-block w-1.5 h-3.5 sm:h-4 ml-1 bg-[#c9b78f]/80 animate-pulse align-middle" />
          )}
        </p>
      </div>
    </div>
  );
};
