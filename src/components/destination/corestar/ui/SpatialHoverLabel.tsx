import React from 'react';
import { InteractiveEntity } from '../types';

interface SpatialHoverLabelProps {
  entity: InteractiveEntity;
  label: string;
  onClick?: () => void;
  className?: string;
}

const THEME_STYLES: Record<
  InteractiveEntity,
  {
    glow: string;
    border: string;
    accent: string;
    text: string;
  }
> = {
  education: {
    glow: 'rgba(192, 132, 252, 0.45)',
    border: 'rgba(192, 132, 252, 0.5)',
    accent: '#c084fc',
    text: '#f3e8ff',
  },
  interests: {
    glow: 'rgba(244, 114, 182, 0.45)',
    border: 'rgba(244, 114, 182, 0.5)',
    accent: '#f472b6',
    text: '#fdf2f8',
  },
  experience: {
    glow: 'rgba(56, 189, 248, 0.45)',
    border: 'rgba(56, 189, 248, 0.5)',
    accent: '#38bdf8',
    text: '#f0f9ff',
  },
};

/**
 * SpatialHoverLabel:
 * Elegant, code-generated celestial spatial label rendered in proximity to
 * hovered interactive celestial objects (Crystal, Comet, Asteroid).
 */
export const SpatialHoverLabel: React.FC<SpatialHoverLabelProps> = ({
  entity,
  label,
  onClick,
  className = '',
}) => {
  const theme = THEME_STYLES[entity];

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Explore ${label}`}
      className={`pointer-events-auto relative inline-flex items-center cursor-pointer select-none transition-all duration-300 transform hover:scale-105 active:scale-95 animate-in fade-in zoom-in-95 duration-200 ${className}`}
      style={{
        filter: `drop-shadow(0 0 10px ${theme.glow})`,
      }}
    >
      {/* Outer Angular Chamfered Frame (Dual-layer contour inspired by reference UI) */}
      <div
        className="relative px-3.5 py-1.5 flex items-center gap-2 bg-[#070914]/90 backdrop-blur-md"
        style={{
          clipPath:
            'polygon(10px 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0 50%)',
          border: `1px solid ${theme.border}`,
          boxShadow: `inset 0 0 12px ${theme.glow}`,
        }}
      >
        {/* Left Decorative Bracket Accent */}
        <span
          className="text-xs font-mono select-none opacity-80"
          style={{ color: theme.accent }}
        >
          &lt;
        </span>

        {/* Delicate Starlight Pip */}
        <span
          className="text-[10px] select-none"
          style={{ color: theme.accent }}
        >
          ✦
        </span>

        {/* Spatial Label Text */}
        <span
          className="font-serif text-xs uppercase tracking-[0.25em] font-medium"
          style={{ color: theme.text }}
        >
          {label}
        </span>

        {/* Right Decorative Bracket Accent */}
        <span
          className="text-xs font-mono select-none opacity-80"
          style={{ color: theme.accent }}
        >
          &gt;
        </span>
      </div>
    </div>
  );
};

export default SpatialHoverLabel;
