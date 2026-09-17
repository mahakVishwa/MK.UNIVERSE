import React, { useState, useCallback, useEffect } from 'react';
import { SceneCanvas } from './components/canvas/SceneCanvas';
import { AppOverlay } from './components/overlay/AppOverlay';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { useWormholeTravel } from './hooks/useWormholeTravel';
import { Destination, DestinationId, InteractionPhase, NavigationMode } from './types/navigation';
import { GUIDE_DIALOGUES, VISIBLE_DESTINATIONS } from './data/destinations';

export const App: React.FC = () => {
  const systemPrefersReducedMotion = usePrefersReducedMotion();
  const [galaxyFormed, setGalaxyFormed] = useState<boolean>(false);

  // Check URL query parameters for direct previewing (e.g. ?phase=destination&dest=about)
  const initialParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialPhaseParam = (initialParams?.get('phase') as InteractionPhase) || null;
  const initialDestParam = initialParams?.get('dest');
  const matchedDest = initialDestParam ? VISIBLE_DESTINATIONS.find((d) => d.id === initialDestParam) ?? null : null;

  // Interaction & Navigation State
  const [phase, setPhase] = useState<InteractionPhase>(
    initialPhaseParam === 'destination' ? 'destination' : 'arrival'
  );
  const [dialogueStep, setDialogueStep] = useState<number>(0);
  const [navigationMode, setNavigationMode] = useState<NavigationMode | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<DestinationId | null>(
    initialPhaseParam === 'destination' && matchedDest ? matchedDest.id : null
  );
  const [activeDestination, setActiveDestination] = useState<Destination | null>(
    initialPhaseParam === 'destination' ? (matchedDest ?? VISIBLE_DESTINATIONS[0]) : null
  );

  const isReducedMotion = systemPrefersReducedMotion;

  // Callback when wormhole space travel completes and traveler arrives at destination
  const handleTravelArrived = useCallback((destination: Destination) => {
    setActiveDestination(destination);
    setPhase('destination');
  }, []);

  // Reusable wormhole travel engine
  const { travelState, startTravel, resetTravel, isTraveling } = useWormholeTravel({
    reducedMotion: isReducedMotion,
    onArrive: handleTravelArrived,
  });

  const handleGalaxyFormed = useCallback(() => {
    setGalaxyFormed(true);
  }, []);

  const handleStartGuide = useCallback(() => {
    setPhase('guide-intro');
    setDialogueStep(0);
  }, []);

  const handleAdvanceDialogue = useCallback(() => {
    setDialogueStep((prev) => {
      if (prev < GUIDE_DIALOGUES.length - 1) {
        return prev + 1;
      }
      // Reached end of automated introduction: transition to mode question
      setPhase('mode-select');
      return prev;
    });
  }, []);

  const handleSelectMode = useCallback((mode: NavigationMode) => {
    setNavigationMode(mode);
    setPhase('active');
  }, []);

  // Destination selected from celestial paper map: initiates wormhole space travel
  const handleSelectDestination = useCallback(
    (dest: Destination) => {
      // Prevent multiple destination selections
      if (isTraveling) {
        return;
      }

      setSelectedDestination(dest.id);
      setActiveDestination(dest);
      setPhase('traveling');
      startTravel(dest);
    },
    [isTraveling, startTravel]
  );

  // Return to celestial star chart for testing and exploration
  const handleReturnToMap = useCallback(() => {
    resetTravel();
    setSelectedDestination(null);
    setActiveDestination(null);
    // Return to active exploration map
    setPhase(navigationMode === 'guided' ? 'map-reveal' : 'active');
  }, [resetTravel, navigationMode]);

  // Space/Enter shortcut on arrival screen to awaken companion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === 'arrival' && (galaxyFormed || isReducedMotion)) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          handleStartGuide();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [phase, galaxyFormed, isReducedMotion, handleStartGuide]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#040508] text-[#f3ebdd]">
      {/* 3D WebGL Canvas Layer (Quiet distant starlight galaxy, procedural wormhole, destination) */}
      <SceneCanvas
        reducedMotion={isReducedMotion}
        onGalaxyFormed={handleGalaxyFormed}
        warmthBoost={phase !== 'arrival'}
        travelState={travelState}
        currentPhase={phase}
        activeDestination={activeDestination}
      />

      {/* Pure Immersive HTML UI Overlay Layer */}
      <AppOverlay
        reducedMotion={isReducedMotion}
        galaxyFormed={galaxyFormed}
        phase={phase}
        dialogueStep={dialogueStep}
        navigationMode={navigationMode}
        selectedDestination={selectedDestination}
        activeDestination={activeDestination}
        travelState={travelState}
        onAdvanceDialogue={handleAdvanceDialogue}
        onStartGuide={handleStartGuide}
        onSelectMode={handleSelectMode}
        onSelectDestination={handleSelectDestination}
        onSetPhase={setPhase}
        onReturnToMap={handleReturnToMap}
      />
    </div>
  );
};

export default App;
