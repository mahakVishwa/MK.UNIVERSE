import React from 'react';
import { VISIBLE_DESTINATIONS } from '../../data/destinations';
import { Destination, DestinationId } from '../../types/navigation';
import { DestinationNode } from './DestinationNode';

interface HolographicMapProps {
  selectedDestination: DestinationId | null;
  onSelectDestination: (dest: Destination) => void;
  isFolding?: boolean;
  disabled?: boolean;
}

/**
 * HolographicMap: Unboxed celestial map floating directly over the open cosmos.
 * - Zero rectangular containers, zero background boxes, zero headers/footers.
 * - Delicate orbital lines, constellation threads, and five floating celestial landmarks.
 */
export const HolographicMap: React.FC<HolographicMapProps> = ({
  selectedDestination,
  onSelectDestination,
  isFolding = false,
  disabled = false,
}) => {
  return (
    <div
      role="region"
      aria-label="Celestial Star Chart"
      className={`pointer-events-auto relative mx-auto w-full max-w-2xl sm:max-w-3xl h-[440px] sm:h-[500px] celestial-paper-map rounded-2xl sm:rounded-3xl p-4 sm:p-8 select-none shadow-[0_30px_90px_rgba(0,0,0,0.85),0_12px_30px_rgba(0,0,0,0.6)] -rotate-[0.4deg] transition-all duration-700 ${
        isFolding ? 'animate-map-fold pointer-events-none' : 'animate-in fade-in zoom-in-95'
      }`}
    >
      {/* Unfolded quadrant crease lines: subtle horizontal and vertical folds */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-stone-400/5 via-stone-600/15 to-stone-400/5 shadow-[1px_0_1px_rgba(255,255,255,0.4)]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-stone-400/5 via-stone-600/15 to-stone-400/5 shadow-[0_1px_1px_rgba(255,255,255,0.4)]" />

      {/* Subtle astronomical perimeter border */}
      <div className="pointer-events-none absolute inset-2 sm:inset-3 rounded-xl sm:rounded-2xl border border-stone-400/25 pointer-events-none" />
      <div className="pointer-events-none absolute inset-3 sm:inset-4 rounded-lg sm:rounded-xl border border-dashed border-stone-400/20 pointer-events-none" />

      {/* Astronomical Ink Markings: Orbits, Constellation Strands, Coordinate Grid */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle Celestial Center & Crosshairs */}
        <circle cx="50%" cy="50%" r="3" fill="#25221F" opacity="0.6" />
        <line x1="49%" y1="50%" x2="51%" y2="50%" stroke="#25221F" strokeWidth="0.9" opacity="0.75" />
        <line x1="50%" y1="49%" x2="50%" y2="51%" stroke="#25221F" strokeWidth="0.9" opacity="0.75" />

        {/* Delicate Elliptical Orbits in Deep Charcoal-Sepia Ink */}
        <ellipse cx="50%" cy="50%" rx="38%" ry="32%" fill="none" stroke="#483f36" strokeWidth="0.9" strokeDasharray="3 5" opacity="0.5" />
        <ellipse cx="50%" cy="50%" rx="24%" ry="20%" fill="none" stroke="#5a4f44" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.5" />
        <circle cx="50%" cy="30%" r="13%" fill="none" stroke="#785918" strokeWidth="0.9" strokeDasharray="2 4" opacity="0.45" />

        {/* Hand-drawn Constellation Connecting Lines in Rich Ink */}
        <line x1="50%" y1="30%" x2="26%" y2="55%" stroke="#332c25" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
        <line x1="50%" y1="30%" x2="74%" y2="52%" stroke="#332c25" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
        <line x1="26%" y1="55%" x2="38%" y2="78%" stroke="#332c25" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
        <line x1="74%" y1="52%" x2="64%" y2="80%" stroke="#332c25" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />

        {/* Faint Ink Stardust Coordinates */}
        <circle cx="18%" cy="26%" r="1.5" fill="#25221F" opacity="0.45" />
        <circle cx="82%" cy="32%" r="1.5" fill="#25221F" opacity="0.45" />
        <circle cx="44%" cy="16%" r="1.2" fill="#25221F" opacity="0.4" />
        <circle cx="62%" cy="66%" r="1.5" fill="#25221F" opacity="0.45" />
        <circle cx="85%" cy="74%" r="1.2" fill="#25221F" opacity="0.4" />
        <circle cx="15%" cy="68%" r="1.2" fill="#25221F" opacity="0.4" />
        
        {/* Decorative corner quadrant flourishes in Dark Ink #25221F */}
        <text x="24" y="32" fill="#25221F" opacity="0.75" fontSize="10" fontFamily="serif" fontWeight="600">N 52° 14′</text>
        <text x="92%" y="32" textAnchor="end" fill="#25221F" opacity="0.75" fontSize="10" fontFamily="serif" fontWeight="600">E 04° 53′</text>
      </svg>

      {/* 5 Celestial Landmarks in Astronomical Ink */}
      {VISIBLE_DESTINATIONS.map((dest) => (
        <DestinationNode
          key={dest.id}
          destination={dest}
          isSelected={selectedDestination === dest.id}
          onSelect={disabled ? () => {} : onSelectDestination}
        />
      ))}
    </div>
  );
};
