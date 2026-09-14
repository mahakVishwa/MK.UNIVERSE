import React from 'react';
import { Destination } from '../../types/navigation';

interface DestinationNodeProps {
  destination: Destination;
  isSelected: boolean;
  onSelect: (destination: Destination) => void;
  isMobileList?: boolean;
}

/**
 * DestinationNode: An illustrated celestial landmark on the companion's star chart.
 * Represents a poetic place in the universe with custom celestial icons:
 * - Miniature Warm Sun (About)
 * - Planetary Orbit System (Skills)
 * - Luminous Nebula (Projects)
 * - Celestial Orbit Clock (Timeline)
 * - Whispering Signal Star (Contact)
 */
export const DestinationNode: React.FC<DestinationNodeProps> = ({
  destination,
  isSelected,
  onSelect,
  isMobileList = false,
}) => {
  const { id, label, title, chartCoords } = destination;

  // Desktop positioning via star chart coordinates
  const positionStyle: React.CSSProperties = isMobileList
    ? {}
    : {
        left: `${chartCoords.x}%`,
        top: `${chartCoords.y}%`,
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
      };

  // Render poetic celestial icons in warm astronomical ink
  const renderCelestialArtwork = () => {
    switch (id) {
      case 'about':
        // Miniature Warm Sun (Golden Ink)
        return (
          <div className="relative flex h-11 w-11 items-center justify-center">
            <div className={`absolute inset-0 rounded-full bg-amber-400/15 blur-sm transition-all duration-300 ${isSelected ? 'scale-125 bg-amber-500/25' : ''}`} />
            <svg viewBox="0 0 40 40" className="h-9 w-9">
              <circle cx="20" cy="20" r="7" fill="#b45309" />
              <circle cx="20" cy="20" r="12" stroke="#92400e" strokeWidth="0.9" strokeDasharray="2 3" opacity="0.8" />
              <line x1="20" y1="4" x2="20" y2="7" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="20" y1="33" x2="20" y2="36" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="4" y1="20" x2="7" y2="20" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="33" y1="20" x2="36" y2="20" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        );

      case 'skills':
        // Planetary System (Graphite & Sepia Ink)
        return (
          <div className="relative flex h-11 w-11 items-center justify-center">
            <div className={`absolute inset-0 rounded-full bg-stone-400/20 blur-sm transition-all duration-300 ${isSelected ? 'scale-125 bg-stone-500/30' : ''}`} />
            <svg viewBox="0 0 40 40" className="h-9 w-9">
              <ellipse cx="20" cy="20" rx="15" ry="6" fill="none" stroke="#57534e" strokeWidth="1.1" transform="rotate(-20 20 20)" opacity="0.85" />
              <circle cx="20" cy="20" r="5.5" fill="#44403c" />
              <circle cx="31" cy="16" r="2.2" fill="#78716c" />
            </svg>
          </div>
        );

      case 'projects':
        // Luminous Nebula Cluster (Dusty Rose-Plum Ink)
        return (
          <div className="relative flex h-11 w-11 items-center justify-center">
            <div className={`absolute inset-0 rounded-full bg-rose-300/20 blur-sm transition-all duration-300 ${isSelected ? 'scale-125 bg-rose-400/30' : ''}`} />
            <svg viewBox="0 0 40 40" className="h-9 w-9">
              <path d="M12 22 Q16 12 24 16 Q32 18 30 26 Q24 32 16 28 Z" fill="#881337" opacity="0.28" />
              <circle cx="20" cy="20" r="2.8" fill="#4c0519" />
              <circle cx="15" cy="17" r="2" fill="#701a75" />
              <circle cx="26" cy="23" r="1.8" fill="#57534e" />
              <circle cx="23" cy="14" r="1.2" fill="#44403c" />
            </svg>
          </div>
        );

      case 'timeline':
        // Celestial Astrolabe / Clock Orbit (Antique Brass Ink)
        return (
          <div className="relative flex h-11 w-11 items-center justify-center">
            <div className={`absolute inset-0 rounded-full bg-amber-300/20 blur-sm transition-all duration-300 ${isSelected ? 'scale-125 bg-amber-400/30' : ''}`} />
            <svg viewBox="0 0 40 40" className="h-9 w-9">
              <circle cx="20" cy="20" r="12" fill="none" stroke="#854d0e" strokeWidth="1.1" strokeDasharray="3 3" opacity="0.85" />
              <circle cx="20" cy="20" r="4.5" fill="#713f12" />
              <line x1="20" y1="20" x2="27" y2="15" stroke="#44403c" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="28" cy="14" r="1.8" fill="#b45309" />
            </svg>
          </div>
        );

      case 'contact':
        // Whispering Signal Star (Celestial Indigo Ink)
        return (
          <div className="relative flex h-11 w-11 items-center justify-center">
            <div className={`absolute inset-0 rounded-full bg-indigo-300/20 blur-sm transition-all duration-300 ${isSelected ? 'scale-125 bg-indigo-400/30' : ''}`} />
            <svg viewBox="0 0 40 40" className="h-9 w-9">
              <path d="M20 12 C25 12 28 15 28 20" fill="none" stroke="#312e81" strokeWidth="1.1" strokeDasharray="1.5 2" opacity="0.75" />
              <path d="M20 8 C28 8 32 12 32 20" fill="none" stroke="#4338ca" strokeWidth="0.9" strokeDasharray="2 3" opacity="0.6" />
              {/* Star symbol */}
              <polygon points="20,13 22,18 27,20 22,22 20,27 18,22 13,20 18,18" fill="#1e1b4b" />
            </svg>
          </div>
        );
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(destination)}
      aria-label={`Destination: ${label} - ${title}`}
      aria-pressed={isSelected}
      style={positionStyle}
      className={`group pointer-events-auto flex items-center transition-all duration-300 focus:outline-none active:scale-95 ${
        isMobileList
          ? 'w-full gap-4 rounded-xl border border-stone-300/60 bg-[#f7f4ed]/90 p-3 text-left hover:border-stone-400/80 shadow-sm'
          : 'flex-col gap-1 text-center hover:scale-110'
      } ${
        isSelected && !isMobileList
          ? 'scale-105 drop-shadow-[0_4px_10px_rgba(120,100,70,0.35)]'
          : ''
      } ${
        isSelected && isMobileList
          ? 'border-amber-700/50 bg-[#efeade] shadow-sm'
          : ''
      }`}
    >
      {/* Celestial Illustration */}
      <div className="relative flex shrink-0 items-center justify-center">
        {renderCelestialArtwork()}
      </div>

      {/* Poetic Destination Label in Astronomical Ink */}
      <div className={isMobileList ? 'flex-1 min-w-0' : 'max-w-[120px]'}>
        <span className={`font-serif text-xs sm:text-sm tracking-wide transition-colors ${
          isSelected ? 'text-[#12100e] font-bold' : 'text-[#25221F] font-medium group-hover:text-[#12100e]'
        }`}>
          {title}
        </span>
        <p className="text-[10px] sm:text-[11px] text-[#443e39] font-sans font-medium tracking-wide truncate">
          {label}
        </p>
      </div>
    </button>
  );
};
