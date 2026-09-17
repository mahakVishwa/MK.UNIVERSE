import React from 'react';
import { AboutObjectId } from '../../canvas/corestar/coreStarState';

export interface CelestialObjectData {
  id: NonNullable<AboutObjectId>;
  heading: string;
  imageSrc: string;
  accentColor: string;
  glowShadow: string;
  restX: string;
  restY: string;
  width: number;
  height: number;
  animationClass: string;
}

interface IllustratedCelestialObjectProps {
  data: CelestialObjectData;
  isSelected: boolean;
  isAnySelected: boolean;
  parallaxX: number;
  parallaxY: number;
  reducedMotion?: boolean;
  onClick: () => void;
}

/**
 * IllustratedCelestialObject: Renders a distinct faceted celestial object from the reference image
 * (Large Asteroid with satellites, Cyan Comet, Magenta Comet, Orbit Asteroid, Skills Satellite).
 * Features:
 * - True transparent faceted artwork without arbitrary circular masks
 * - Neon rim-light glow and pulsing plasma trails
 * - Continuous 2.5D floating / velocity motion
 * - Smooth translation & scale when focused
 * - Only the subsection name is visible initially
 */
export const IllustratedCelestialObject: React.FC<IllustratedCelestialObjectProps> = ({
  data,
  isSelected,
  isAnySelected,
  parallaxX,
  parallaxY,
  reducedMotion = false,
  onClick,
}) => {
  const pxOffset = parallaxX * 36;
  const pyOffset = parallaxY * 24;

  // Determine positional styles based on focus state
  let targetLeft = data.restX;
  let targetTop = data.restY;
  let targetScale = 1.0;
  let targetOpacity = 1.0;
  let targetPointerEvents: 'auto' | 'none' = 'auto';

  if (isSelected) {
    if (data.id === 'skills') {
      // Skills gateway object glides towards the far right
      targetLeft = '80%';
      targetTop = '50%';
      targetScale = reducedMotion ? 1.4 : 1.7;
      targetOpacity = 1.0;
    } else {
      // Approached celestial object glides towards left-center foreground
      targetLeft = '28%';
      targetTop = '50%';
      targetScale = reducedMotion ? 1.5 : 1.95;
      targetOpacity = 1.0;
    }
  } else if (isAnySelected) {
    // Other objects fade deeply and recede
    targetScale = 0.65;
    targetOpacity = 0.06;
    targetPointerEvents = 'none';
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${data.heading} celestial object`}
      className="group absolute z-20 cursor-pointer select-none focus:outline-none transition-all duration-700 ease-out"
      style={{
        left: targetLeft,
        top: targetTop,
        transform: `translate(-50%, -50%) ${
          !isSelected && !isAnySelected ? `translate(${pxOffset}px, ${pyOffset}px)` : ''
        } scale(${targetScale})`,
        opacity: targetOpacity,
        pointerEvents: targetPointerEvents,
      }}
    >
      <div
        className="relative flex flex-col items-center justify-center"
        style={{
          width: `${data.width}px`,
          height: `${data.height}px`,
          animation:
            !isSelected && !isAnySelected && !reducedMotion
              ? data.animationClass
              : 'none',
        }}
      >
        {/* Faceted Celestial Body Image with Neon Rim Glow */}
        <img
          src={data.imageSrc}
          alt={data.heading}
          className="w-full h-full object-contain select-none pointer-events-none transition-transform duration-300 group-hover:scale-105"
          style={{
            filter: isSelected
              ? `${data.glowShadow} brightness(1.25) contrast(1.15)`
              : data.glowShadow,
          }}
        />

        {/* Delicate Starlight Subsection Label (Visible only initially when not focused) */}
        {!isAnySelected && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
            <span
              className="font-serif text-[9.5px] sm:text-[10px] md:text-[11px] tracking-[0.32em] text-[#c9b78f]/85 uppercase whitespace-nowrap transition-all duration-300 group-hover:text-[#ffffff] group-hover:tracking-[0.40em] group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
            >
              {data.heading}
            </span>
            <span
              className="mt-0.5 h-[1.5px] w-3.5 bg-[#c9b78f]/40 group-hover:w-8 group-hover:bg-[#f3ebdd] transition-all duration-300"
              style={{
                boxShadow: `0 0 6px ${data.accentColor}`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default IllustratedCelestialObject;
