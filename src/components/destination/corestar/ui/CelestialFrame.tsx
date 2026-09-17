import React, { useEffect } from 'react';
import { InteractiveEntity } from '../types';

interface CelestialFrameProps {
  entity: InteractiveEntity;
  title: string;
  symbol?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const THEME_ACCENTS: Record<
  InteractiveEntity,
  {
    primary: string;
    secondary: string;
    glow: string;
    border: string;
    cornerNode: string;
  }
> = {
  education: {
    primary: '#c084fc', // Violet starlight
    secondary: '#38bdf8', // Electric blue
    glow: 'rgba(192, 132, 252, 0.35)',
    border: 'rgba(192, 132, 252, 0.45)',
    cornerNode: '#e9d5ff',
  },
  interests: {
    primary: '#f472b6', // Speeding magenta
    secondary: '#fbbf24', // Solar gold
    glow: 'rgba(244, 114, 182, 0.35)',
    border: 'rgba(244, 114, 182, 0.45)',
    cornerNode: '#fbcfe8',
  },
  experience: {
    primary: '#38bdf8', // Electric cyan
    secondary: '#818cf8', // Indigo
    glow: 'rgba(56, 189, 248, 0.35)',
    border: 'rgba(56, 189, 248, 0.45)',
    cornerNode: '#bae6fd',
  },
};

/**
 * CelestialFrame:
 * Code-generated angular sci-fi / celestial HUD panel inspired by the design references.
 * Features dual-layered luminous outlines, chamfered asymmetric geometry, decorative
 * corner brackets, tick marks, and subtle starlight glow.
 */
export const CelestialFrame: React.FC<CelestialFrameProps> = ({
  entity,
  title,
  symbol = '✦',
  onClose,
  children,
  className = '',
}) => {
  const theme = THEME_ACCENTS[entity];

  // Global Escape key listener to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-label={`${title} Information`}
      aria-modal="true"
      onClick={(e) => e.stopPropagation()}
      className={`pointer-events-auto relative select-none animate-in fade-in zoom-in-95 duration-400 ease-out ${className}`}
      style={{
        filter: `drop-shadow(0 16px 36px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 20px ${theme.glow})`,
      }}
    >
      {/* 1. OUTER DECORATIVE RAIL & CORNER BRACKETS (Inspired by Vector HUD Reference) */}
      <div className="absolute -inset-1.5 pointer-events-none">
        {/* Top-Left Chamfer Outer Bracket */}
        <div
          className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-2 border-l-2 opacity-80"
          style={{ borderColor: theme.primary }}
        />
        {/* Top-Right Outer Bracket */}
        <div
          className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-2 border-r-2 opacity-80"
          style={{ borderColor: theme.primary }}
        />
        {/* Bottom-Left Outer Bracket */}
        <div
          className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-2 border-l-2 opacity-80"
          style={{ borderColor: theme.primary }}
        />
        {/* Bottom-Right Chamfer Outer Bracket */}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-2 border-r-2 opacity-80"
          style={{ borderColor: theme.primary }}
        />

        {/* Luminous Micro Nodes on Diagonal Chamfers */}
        <div
          className="absolute top-1 left-6 w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: theme.cornerNode, boxShadow: `0 0 6px ${theme.primary}` }}
        />
        <div
          className="absolute bottom-1 right-6 w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: theme.cornerNode, boxShadow: `0 0 6px ${theme.primary}` }}
        />
      </div>

      {/* 2. MAIN INNER ANGULAR CONTAINER */}
      <div
        className="relative bg-[#060814]/88 backdrop-blur-xl border border-white/10 p-5 sm:p-6 overflow-hidden"
        style={{
          clipPath:
            'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 24px), calc(100% - 24px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)',
          boxShadow: `inset 0 0 24px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
          border: `1px solid ${theme.border}`,
        }}
      >
        {/* Subtle Diagonal Sheen Glass Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 45%, rgba(255,255,255,0.05) 100%)',
          }}
        />

        {/* Diagonal Slats / Tick Marks at the Top Edge (Inspired by sci-fi frame reference) */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-40">
          <span className="w-2.5 h-[1px] -rotate-45" style={{ backgroundColor: theme.primary }} />
          <span className="w-2.5 h-[1px] -rotate-45" style={{ backgroundColor: theme.primary }} />
          <span className="w-2.5 h-[1px] -rotate-45" style={{ backgroundColor: theme.primary }} />
          <span className="w-2.5 h-[1px] -rotate-45" style={{ backgroundColor: theme.primary }} />
        </div>

        {/* ============================================================ */}
        {/* 3. HEADER WITH CELESTIAL TITLE & DISMISS BUTTON              */}
        {/* ============================================================ */}
        <div className="relative flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
          {/* Section Category & Symbol */}
          <div className="flex items-center gap-2">
            <span
              className="text-base select-none drop-shadow-[0_0_8px_currentColor]"
              style={{ color: theme.primary }}
              aria-hidden="true"
            >
              {symbol}
            </span>
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[0.35em] text-[#d9d2c5]/60">
                Core Star Landmark
              </span>
              <h2 className="font-serif text-lg sm:text-xl uppercase tracking-[0.2em] font-normal text-[#f3ebdd] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                {title}
              </h2>
            </div>
          </div>

          {/* Dismiss / Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title} information`}
            className="group relative p-1.5 rounded-xs transition-all duration-200 hover:scale-110 active:scale-95 border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10"
            style={{
              boxShadow: `0 0 10px transparent`,
            }}
          >
            <span className="block w-4 h-4 text-center leading-4 text-xs font-mono text-[#d9d2c5] group-hover:text-white transition-colors">
              ✕
            </span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* 4. MAIN CONTENT AREA                                         */}
        {/* ============================================================ */}
        <div className="relative text-left space-y-4">
          {children}
        </div>

        {/* ============================================================ */}
        {/* 5. FOOTER RETURN ACTION / HINT                               */}
        {/* ============================================================ */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#d9d2c5]/60 font-mono">
          <span className="tracking-widest flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rotate-45" style={{ backgroundColor: theme.primary }} />
            <span>MK.UNIVERSE</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="tracking-wider text-[#d9d2c5]/75 hover:text-[#f3ebdd] transition-colors cursor-pointer"
          >
            dismiss [esc] ✦
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelestialFrame;
