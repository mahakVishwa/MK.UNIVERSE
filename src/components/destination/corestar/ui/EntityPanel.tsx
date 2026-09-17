import React from 'react';
import { InteractiveEntity } from '../types';
import { CORE_STAR_CONTENT } from '../contentData';
import { CelestialFrame } from './CelestialFrame';

interface EntityPanelProps {
  entity: InteractiveEntity;
  onClose: () => void;
  className?: string;
}

/**
 * EntityPanel:
 * Renders the spatial information panel for Education, Interests, or Experience
 * embedded in the code-generated CelestialFrame.
 *
 * Implements restrained staggered text animations, elegant typography,
 * high visual contrast, and responsive layout that never dominates the artwork.
 */
export const EntityPanel: React.FC<EntityPanelProps> = ({
  entity,
  onClose,
  className = '',
}) => {
  const content = CORE_STAR_CONTENT[entity];

  return (
    <CelestialFrame
      entity={entity}
      title={content.category}
      symbol={content.symbol}
      onClose={onClose}
      className={className}
    >
      {/* ============================================================ */}
      {/* 1. EDUCATION (CRYSTAL)                                        */}
      {/* ============================================================ */}
      {content.type === 'education' && (
        <div className="space-y-3.5">
          {/* Degree & Expected Year */}
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
            <h3 className="font-serif text-base sm:text-lg font-medium text-[#7dd3fc] tracking-wide">
              {content.degree}
            </h3>
            <span className="inline-flex self-start sm:self-auto items-center px-2 py-0.5 text-[11px] font-mono tracking-wider text-[#fef08a] bg-[#fef08a]/10 border border-[#fef08a]/30 rounded-xs">
              {content.expectedYear}
            </span>
          </div>

          {/* Institution */}
          <p className="text-xs sm:text-sm text-[#d9d2c5]/90 leading-relaxed font-sans">
            {content.institution}
          </p>

          {/* Academic Highlights & Scores */}
          <div className="pt-2.5 border-t border-white/10 space-y-1.5">
            <div className="flex items-center justify-between py-1.5 px-3 rounded-xs bg-white/[0.04] border border-white/10">
              <span className="text-xs font-mono uppercase tracking-wider text-[#d9d2c5]/70">
                Grade
              </span>
              <span className="font-mono text-xs sm:text-sm font-semibold text-[#fbbf24] tracking-widest drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                {content.metrics.cgpa}
              </span>
            </div>

            <div className="py-1.5 px-3 rounded-xs bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-xs font-serif text-[#f3ebdd] tracking-wide">
                {content.metrics.higherSecondary}
              </span>
              <span className="text-[10px] text-[#c084fc] font-mono">✦</span>
            </div>

            <div className="py-1.5 px-3 rounded-xs bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-xs font-serif text-[#f3ebdd] tracking-wide">
                {content.metrics.secondary}
              </span>
              <span className="text-[10px] text-[#c084fc] font-mono">✦</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. INTERESTS (COMET) — Visually Spacious                       */}
      {/* ============================================================ */}
      {content.type === 'interests' && (
        <div className="py-2 space-y-3">
          {content.items.map((item, idx) => (
            <div
              key={item}
              className="group relative flex items-center justify-between p-3 rounded-xs bg-white/[0.03] border border-white/5 hover:border-[#f472b6]/40 hover:bg-white/[0.06] transition-all duration-300"
              style={{
                animationDelay: `${idx * 80}ms`,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#f472b6] opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform">
                  0{idx + 1} //
                </span>
                <span className="font-serif text-sm sm:text-base text-[#f3ebdd] tracking-wider group-hover:text-white transition-colors">
                  {item}
                </span>
              </div>
              <span className="text-xs text-[#fbbf24] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" aria-hidden="true">
                ✦
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. EXPERIENCE (ASTEROID)                                      */}
      {/* ============================================================ */}
      {content.type === 'experience' && (
        <div className="space-y-3">
          {/* Role */}
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-[#38bdf8]/75 mb-0.5">
              Role
            </span>
            <h3 className="font-serif text-base sm:text-lg font-medium text-[#f3ebdd] tracking-wide">
              {content.role}
            </h3>
          </div>

          {/* Organization / Company */}
          <div className="py-2 px-3 rounded-xs bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-[#d9d2c5]/60">
                Organization
              </span>
              <span className="font-serif text-sm sm:text-base text-[#7dd3fc] tracking-wider">
                {content.company}
              </span>
            </div>
            <span className="text-xs font-mono text-[#38bdf8] opacity-60">
              ◈
            </span>
          </div>

          {/* Tenure & Modality */}
          <div className="pt-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
            <span className="font-mono text-xs text-[#d9d2c5]/80 tracking-wide">
              {content.meta}
            </span>
          </div>
        </div>
      )}
    </CelestialFrame>
  );
};

export default EntityPanel;
