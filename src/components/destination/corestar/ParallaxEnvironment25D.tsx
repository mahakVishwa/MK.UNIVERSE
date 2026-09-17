import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ParallaxSceneProps } from './types';
import { CORE_STAR_LAYERS, PARALLAX_SETTINGS } from './sceneConfig';
import { ROLE_TO_ENTITY } from './contentData';
import { SpatialHoverLabel } from './ui/SpatialHoverLabel';

/**
 * ParallaxEnvironment25D:
 * A high-performance 2.5D multiplane parallax scene engine.
 *
 * Positions each cosmic asset at its own independent viewport-relative scale and
 * normalized center coordinates, while preserving individual aspect ratios and applying
 * subtle depth-proportional virtual camera parallax around their neutral positions.
 */
export const ParallaxEnvironment25D: React.FC<ParallaxSceneProps> = ({
  layers = CORE_STAR_LAYERS,
  reducedMotion = false,
  className = '',
  focusedEntity = null,
  hoveredEntity = null,
  onEntityHover,
  onEntitySelect,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<HTMLDivElement | null>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Pointer smoothing state (exponential lerp)
  const targetPointerRef = useRef({ x: 0, y: 0 });
  const currentPointerRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);

  // Asset loading tracker for smooth fade-in
  const [isLoaded, setIsLoaded] = useState(false);
  const loadedCountRef = useRef(0);

  const handleImageLoad = useCallback(() => {
    loadedCountRef.current += 1;
    if (loadedCountRef.current >= layers.length) {
      setIsLoaded(true);
    }
  }, [layers.length]);

  // Main animation loop: smooth lerp toward target coordinates
  useEffect(() => {
    if (reducedMotion) {
      if (cameraRef.current) {
        cameraRef.current.style.transform = 'none';
      }
      layers.forEach((layer, idx) => {
        const el = layerRefs.current[idx];
        if (!el) return;
        if (layer.layoutType === 'centered') {
          el.style.transform = 'translate(-50%, -50%) translate3d(0px, 0px, 0px)';
        } else if (layer.layoutType === 'bottom-aligned') {
          el.style.transform = 'translate(-50%, 0px) translate3d(0px, 0px, 0px)';
        } else {
          el.style.transform = 'translate3d(0px, 0px, 0px)';
        }
      });
      return;
    }

    const {
      baseDisplacementX,
      baseDisplacementY,
      lerpFactor,
      cameraTiltX,
      cameraTiltY,
    } = PARALLAX_SETTINGS;

    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;

      const targetX = targetPointerRef.current.x;
      const targetY = targetPointerRef.current.y;
      const curr = currentPointerRef.current;

      // Smooth exponential lerp
      curr.x += (targetX - curr.x) * lerpFactor;
      curr.y += (targetY - curr.y) * lerpFactor;

      // Clamp minute deltas to prevent microscopic floating-point jitter
      if (Math.abs(targetX - curr.x) < 0.0001 && Math.abs(targetY - curr.y) < 0.0001) {
        curr.x = targetX;
        curr.y = targetY;
      }

      // 1. Subtle camera viewport rotation
      if (cameraRef.current) {
        const rotY = curr.x * cameraTiltX;
        const rotX = -curr.y * cameraTiltY;
        cameraRef.current.style.transform = `rotateY(${rotY.toFixed(3)}deg) rotateX(${rotX.toFixed(3)}deg)`;
      }

      // 2. Depth-based translation of each independent layer plane
      layers.forEach((layer, idx) => {
        const el = layerRefs.current[idx];
        if (!el) return;

        const ratioX = layer.parallaxRatio;
        const ratioY = layer.parallaxRatioY ?? layer.parallaxRatio;

        const translateX = -curr.x * baseDisplacementX * ratioX;
        const translateY = -curr.y * baseDisplacementY * ratioY;

        if (layer.layoutType === 'centered') {
          el.style.transform = `translate(-50%, -50%) translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0px)`;
        } else if (layer.layoutType === 'bottom-aligned') {
          el.style.transform = `translate(-50%, 0px) translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0px)`;
        } else {
          el.style.transform = `translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0px)`;
        }
      });

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [layers, reducedMotion]);

  // Pointer tracking & boundary listeners
  useEffect(() => {
    if (reducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;

      targetPointerRef.current = {
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny)),
      };
    };

    // Gently return to neutral position when cursor exits window or window blurs
    const handlePointerLeave = () => {
      targetPointerRef.current = { x: 0, y: 0 };
    };

    const handleWindowBlur = () => {
      targetPointerRef.current = { x: 0, y: 0 };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const nx = (touch.clientX / window.innerWidth) * 2 - 1;
        const ny = (touch.clientY / window.innerHeight) * 2 - 1;
        targetPointerRef.current = {
          x: Math.max(-1, Math.min(1, nx)),
          y: Math.max(-1, Math.min(1, ny)),
        };
      }
    };

    const handleTouchEnd = () => {
      targetPointerRef.current = { x: 0, y: 0 };
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [reducedMotion]);

  // Ensure visibility fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="The Core Star Cosmic Environment"
      className={`relative w-full h-full overflow-hidden select-none bg-[#040508] ${className}`}
      style={{
        perspective: `${PARALLAX_SETTINGS.perspectivePx}px`,
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Virtual 3D Camera Rig */}
      <div
        ref={cameraRef}
        className="relative w-full h-full transform-gpu"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <div
          className={`relative w-full h-full pointer-events-none transition-opacity duration-700 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {layers.map((layer, index) => {
            // 1. BACKGROUND — Furthest layer, fills viewport with overscan
            if (layer.layoutType === 'background') {
              return (
                <div
                  key={layer.id}
                  ref={(el) => {
                    layerRefs.current[index] = el;
                  }}
                  id={layer.id}
                  data-layer-id={layer.id}
                  data-layer-role={layer.role}
                  data-depth-level={layer.depthLevel}
                  data-interactive={layer.isInteractiveTarget ? 'true' : 'false'}
                  className="absolute inset-[-7%] w-[114%] h-[114%] pointer-events-none will-change-transform transition-all duration-700 ease-out"
                  style={{
                    zIndex: layer.zIndex,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    opacity: focusedEntity ? 0.32 : 1,
                    filter: focusedEntity ? 'brightness(0.65) blur(1px)' : 'none',
                  }}
                >
                  <img
                    src={layer.src}
                    alt={layer.alt}
                    aria-hidden="true"
                    draggable={false}
                    onLoad={handleImageLoad}
                    className="w-full h-full object-cover object-center select-none pointer-events-none"
                  />
                </div>
              );
            }

            // 2. BOTTOM-ALIGNED FOREGROUND GROUND — Anchored to bottom, width 110% vw
            if (layer.layoutType === 'bottom-aligned') {
              return (
                <div
                  key={layer.id}
                  ref={(el) => {
                    layerRefs.current[index] = el;
                  }}
                  id={layer.id}
                  data-layer-id={layer.id}
                  data-layer-role={layer.role}
                  data-depth-level={layer.depthLevel}
                  data-interactive={layer.isInteractiveTarget ? 'true' : 'false'}
                  className="absolute pointer-events-none will-change-transform transition-all duration-700 ease-out"
                  style={{
                    left: '50%',
                    bottom: `${layer.bottomOffsetVh ?? 0}vh`,
                    width: `${layer.widthVw ?? 110}vw`,
                    transform: 'translate(-50%, 0px) translate3d(0px, 0px, 0px)',
                    zIndex: layer.zIndex,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    opacity: focusedEntity ? 0.32 : 1,
                    filter: focusedEntity ? 'brightness(0.65) blur(1px)' : 'none',
                  }}
                >
                  <img
                    src={layer.src}
                    alt={layer.alt}
                    aria-hidden="true"
                    draggable={false}
                    onLoad={handleImageLoad}
                    className="w-full h-auto block select-none pointer-events-none"
                  />
                </div>
              );
            }

            // 3. INDEPENDENT CENTERED CELESTIAL OBJECTS (Sun, Orbit, Crystal, Asteroid, Comet)
            const cx = (layer.centerX ?? 0.5) * 100;
            const cy = (layer.centerY ?? 0.5) * 100;
            const width = layer.widthVw ?? 30;

            const entity = layer.isInteractiveTarget ? ROLE_TO_ENTITY[layer.role] : null;
            const isThisFocused = entity !== null && focusedEntity === entity;
            const isAnotherFocused = focusedEntity !== null && !isThisFocused;
            const isThisHovered = entity !== null && hoveredEntity === entity && !focusedEntity;

            const labelTexts: Record<string, string> = {
              crystal: 'Education',
              comet: 'Interests',
              asteroid: 'Experience',
            };

            const glowStyles: Record<string, { hover: string; focus: string }> = {
              crystal: {
                hover: 'drop-shadow(0 0 20px rgba(192, 132, 252, 0.75))',
                focus: 'drop-shadow(0 0 32px rgba(192, 132, 252, 0.95)) drop-shadow(0 0 60px rgba(147, 51, 234, 0.45)) brightness(1.15)',
              },
              comet: {
                hover: 'drop-shadow(0 0 22px rgba(244, 114, 182, 0.75))',
                focus: 'drop-shadow(0 0 32px rgba(244, 114, 182, 0.95)) drop-shadow(0 0 60px rgba(219, 39, 119, 0.45)) brightness(1.15)',
              },
              asteroid: {
                hover: 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.75))',
                focus: 'drop-shadow(0 0 32px rgba(56, 189, 248, 0.95)) drop-shadow(0 0 60px rgba(37, 99, 235, 0.45)) brightness(1.15)',
              },
            };

            const glow = glowStyles[layer.role];
            let imageFilter = 'none';
            if (isThisFocused && glow) {
              imageFilter = glow.focus;
            } else if (isThisHovered && glow) {
              imageFilter = glow.hover;
            } else if (isAnotherFocused) {
              imageFilter = 'brightness(0.65) blur(1px)';
            }

            return (
              <div
                key={layer.id}
                ref={(el) => {
                  layerRefs.current[index] = el;
                }}
                id={layer.id}
                data-layer-id={layer.id}
                data-layer-role={layer.role}
                data-depth-level={layer.depthLevel}
                data-interactive={layer.isInteractiveTarget ? 'true' : 'false'}
                className="absolute pointer-events-none will-change-transform transition-all duration-700 ease-out"
                style={{
                  left: `${cx}%`,
                  top: `${cy}%`,
                  width: `${width}vw`,
                  transform: 'translate(-50%, -50%) translate3d(0px, 0px, 0px)',
                  zIndex: isThisFocused ? 60 : layer.zIndex,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  opacity: isAnotherFocused ? 0.32 : 1,
                }}
              >
                {/* Spatial Hover Label (Pinned relative to the entity in 2.5D space) */}
                {isThisHovered && entity && (
                  <div
                    className={`absolute z-50 pointer-events-auto ${
                      layer.role === 'comet'
                        ? 'top-[78%] left-1/2 -translate-x-1/2'
                        : '-top-8 left-1/2 -translate-x-1/2'
                    }`}
                  >
                    <SpatialHoverLabel
                      entity={entity}
                      label={labelTexts[layer.role]}
                      onClick={() => onEntitySelect?.(entity)}
                    />
                  </div>
                )}

                {entity ? (
                  <button
                    type="button"
                    onClick={() => onEntitySelect?.(entity)}
                    onMouseEnter={() => onEntityHover?.(entity)}
                    onMouseLeave={() => onEntityHover?.(null)}
                    onFocus={() => onEntityHover?.(entity)}
                    onBlur={() => onEntityHover?.(null)}
                    aria-label={`Explore ${labelTexts[layer.role]}`}
                    className={`pointer-events-auto block w-full h-auto cursor-pointer focus:outline-none transition-transform duration-300 ${
                      isThisHovered
                        ? 'scale-[1.04]'
                        : isThisFocused
                        ? 'scale-[1.05]'
                        : 'hover:scale-[1.02]'
                    }`}
                  >
                    <img
                      src={layer.src}
                      alt={layer.alt}
                      aria-hidden="true"
                      draggable={false}
                      onLoad={handleImageLoad}
                      className="w-full h-auto block select-none pointer-events-none transition-all duration-500"
                      style={{
                        filter: imageFilter,
                      }}
                    />
                  </button>
                ) : (
                  <img
                    src={layer.src}
                    alt={layer.alt}
                    aria-hidden="true"
                    draggable={false}
                    onLoad={handleImageLoad}
                    className="w-full h-auto block select-none pointer-events-none transition-all duration-500"
                    style={{
                      filter: imageFilter,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ParallaxEnvironment25D;
