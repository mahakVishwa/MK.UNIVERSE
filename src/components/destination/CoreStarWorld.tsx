import React, { useEffect, useState, useCallback } from 'react';
import { Destination } from '../../types/navigation';
import { ParallaxEnvironment25D } from './corestar/ParallaxEnvironment25D';
import { CORE_STAR_LAYERS } from './corestar/sceneConfig';
import { InteractiveEntity, ViewedSectionsState } from './corestar/types';
import { EntityPanel } from './corestar/ui/EntityPanel';
import { CompanionReturn } from './corestar/ui/CompanionReturn';

interface CoreStarWorldProps {
  destination?: Destination | null;
  onReturnToMap?: () => void;
  onSelectDestination?: (dest: Destination) => void;
  reducedMotion?: boolean;
}

/**
 * CoreStarWorld:
 * THE CORE STAR interactive cosmic destination.
 *
 * Layers:
 * 1. 2.5D Multiplane Parallax Environment (Artwork & Physical Depth)
 * 2. Interaction State Coordination (Hover, Focus, Dimming, Parallax coordination)
 * 3. Spatial Coded Celestial UI Panels (Education, Interests, Experience)
 * 4. Viewed Section State Tracking (Three-object completion pipeline)
 */
export const CoreStarWorld: React.FC<CoreStarWorldProps> = ({
  onReturnToMap,
  onSelectDestination,
  reducedMotion = false,
}) => {
  // Active focused entity panel ('education' | 'interests' | 'experience' | null)
  const [focusedEntity, setFocusedEntity] = useState<InteractiveEntity | null>(null);

  // Active hovered entity for subtle spatial cues
  const [hoveredEntity, setHoveredEntity] = useState<InteractiveEntity | null>(null);

  // Exploration progress tracker (viewed states)
  const [viewedSections, setViewedSections] = useState<ViewedSectionsState>({
    educationViewed: false,
    interestsViewed: false,
    experienceViewed: false,
  });

  // Companion return narrative state
  const [companionReturned, setCompanionReturned] = useState(false);

  const allViewed =
    viewedSections.educationViewed &&
    viewedSections.interestsViewed &&
    viewedSections.experienceViewed;

  // Entity selection handler
  const handleSelectEntity = useCallback((entity: InteractiveEntity) => {
    setFocusedEntity(entity);

    // Track exploration completion: only genuine selection/viewing marks it true
    setViewedSections((prev) => {
      if (entity === 'education' && !prev.educationViewed) {
        return { ...prev, educationViewed: true };
      }
      if (entity === 'interests' && !prev.interestsViewed) {
        return { ...prev, interestsViewed: true };
      }
      if (entity === 'experience' && !prev.experienceViewed) {
        return { ...prev, experienceViewed: true };
      }
      return prev;
    });
  }, []);

  // Dismiss / return to neutral environment
  const handleClosePanel = useCallback(() => {
    setFocusedEntity(null);
  }, []);

  // Trigger companion narrative return when all three landmarks are viewed and the panel is closed
  useEffect(() => {
    if (allViewed && !companionReturned && !focusedEntity) {
      const timer = setTimeout(() => {
        setCompanionReturned(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [allViewed, companionReturned, focusedEntity]);

  // Global Keyboard Navigation:
  // - Escape when a panel is open: dismiss panel
  // - Escape / Backspace when neutral: return to celestial star chart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        if (focusedEntity) {
          e.preventDefault();
          handleClosePanel();
        } else {
          onReturnToMap?.();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedEntity, handleClosePanel, onReturnToMap]);

  return (
    <div
      role="region"
      aria-label="The Core Star - 2.5D Cosmic Parallax Environment"
      data-viewed-education={viewedSections.educationViewed}
      data-viewed-interests={viewedSections.interestsViewed}
      data-viewed-experience={viewedSections.experienceViewed}
      data-all-viewed={allViewed}
      data-companion-returned={companionReturned}
      className="fixed inset-0 z-20 select-none overflow-hidden bg-[#040508]"
    >
      {/* 1. 2.5D PARALLAX ENVIRONMENT LAYER (Underlying Physical Universe) */}
      <ParallaxEnvironment25D
        layers={CORE_STAR_LAYERS}
        reducedMotion={reducedMotion}
        focusedEntity={focusedEntity}
        hoveredEntity={hoveredEntity}
        onEntityHover={setHoveredEntity}
        onEntitySelect={handleSelectEntity}
        className="w-full h-full"
      />

      {/* 2. SPATIAL INTERACTION & INFORMATION UI LAYER */}
      {focusedEntity && (
        <div
          onClick={handleClosePanel}
          className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
        >
          {/* Subtle click-away backdrop wash (Very translucent, preserves artwork visibility) */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-500" />

          {/* Spatial Panel Positioning relative to the focused celestial landmark */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative z-10 w-full max-w-[390px] transition-all duration-500 ${
              focusedEntity === 'education'
                ? 'md:absolute md:left-[28vw] md:top-[38vh]'
                : focusedEntity === 'interests'
                ? 'md:absolute md:right-[26vw] md:top-[20vh]'
                : 'md:absolute md:right-[23vw] md:top-[44vh]'
            }`}
          >
            <EntityPanel
              entity={focusedEntity}
              onClose={handleClosePanel}
            />
          </div>
        </div>
      )}

      {/* 3. COMPANION RETURN NARRATIVE TRANSITION (Triggered after all 3 sections viewed) */}
      {companionReturned && !focusedEntity && (
        <CompanionReturn
          reducedMotion={reducedMotion}
          onReturnToMap={onReturnToMap}
          onSelectDestination={onSelectDestination}
        />
      )}
    </div>
  );
};

export default CoreStarWorld;
