import { useState, useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { Destination } from '../types/navigation';
import { TravelPhase, TravelState } from '../types/travel';
import { getTravelConfigForDestination } from '../data/travelConfigs';

interface UseWormholeTravelOptions {
  reducedMotion?: boolean;
  onArrive?: (destination: Destination) => void;
}

const INITIAL_TRAVEL_STATE: TravelState = {
  phase: 'idle',
  activeDestination: null,
  isTraveling: false,
  progress: 0,
  speed: 0,
  stretch: 0,
  tunnelOpacity: 0,
  exitFlash: 0,
  fovOffset: 0,
};

export function useWormholeTravel({
  reducedMotion = false,
  onArrive,
}: UseWormholeTravelOptions = {}) {
  const [travelState, setTravelState] = useState<TravelState>(INITIAL_TRAVEL_STATE);

  // Keep ref to avoid duplicate transitions while traveling
  const isTravelingRef = useRef<boolean>(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Clean up any running timeline on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, []);

  const resetTravel = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    isTravelingRef.current = false;
    setTravelState(INITIAL_TRAVEL_STATE);
  }, []);

  const startTravel = useCallback(
    (destination: Destination) => {
      // Prevent multiple destination selections during active travel
      if (isTravelingRef.current) {
        return;
      }

      isTravelingRef.current = true;
      const config = getTravelConfigForDestination(destination.id);

      // Kill any previous timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Plain numeric values animated smoothly by GSAP
      const animValues = {
        progress: 0,
        speed: 0,
        stretch: 0,
        tunnelOpacity: 0,
        exitFlash: 0,
        fovOffset: 0,
      };

      // Helper to push updates into React state
      const updateState = (phase: TravelPhase) => {
        setTravelState({
          phase,
          activeDestination: destination,
          isTraveling: true,
          progress: animValues.progress,
          speed: animValues.speed,
          stretch: animValues.stretch,
          tunnelOpacity: animValues.tunnelOpacity,
          exitFlash: animValues.exitFlash,
          fovOffset: animValues.fovOffset,
        });
      };

      if (reducedMotion) {
        // ACCESSIBLE REDUCED MOTION FLOW:
        // Gentle, shortened 1.0s transition.
        // No rapid camera FOV changes, no high-speed streak elongation, zero disorienting spin.
        const tl = gsap.timeline({
          onComplete: () => {
            isTravelingRef.current = false;
            setTravelState({
              phase: 'arrival',
              activeDestination: destination,
              isTraveling: false,
              progress: 1.0,
              speed: 0,
              stretch: 0,
              tunnelOpacity: 0,
              exitFlash: 0,
              fovOffset: 0,
            });
            onArrive?.(destination);
          },
        });

        timelineRef.current = tl;

        // 1. Departure (0.0 -> 0.35s): map folds/fades
        tl.to(animValues, {
          progress: 0.35,
          duration: 0.35,
          ease: 'power1.out',
          onStart: () => updateState('departure'),
          onUpdate: () => updateState('departure'),
        });

        // 2. Quiet drift (0.35 -> 0.75s): subtle starlight shift
        tl.to(animValues, {
          progress: 0.75,
          duration: 0.4,
          ease: 'sine.inOut',
          onStart: () => updateState('wormhole'),
          onUpdate: () => updateState('wormhole'),
        });

        // 3. Gentle arrival (0.75 -> 1.0s): fade into placeholder
        tl.to(animValues, {
          progress: 1.0,
          duration: 0.25,
          ease: 'power1.out',
          onStart: () => updateState('arrival'),
          onUpdate: () => updateState('arrival'),
        });

        return;
      }

      // CINEMATIC NORMAL MOTION FLOW:
      // Map → departure → acceleration → wormhole → travel → deceleration → arrival
      const totalDuration = config.duration; // e.g. 4.2s
      const departureDuration = 0.6;         // map fold & pause
      const accelDuration = 1.0;             // star streaks stretch, space accelerates
      const wormholeDuration = totalDuration - departureDuration - accelDuration - 0.9; // ~1.7s
      const decelDuration = 0.9;             // streaks compress, starlight wash, settle

      const tl = gsap.timeline({
        onComplete: () => {
          isTravelingRef.current = false;
          setTravelState({
            phase: 'arrival',
            activeDestination: destination,
            isTraveling: false,
            progress: 1.0,
            speed: 0,
            stretch: 0,
            tunnelOpacity: 0,
            exitFlash: 0,
            fovOffset: 0,
          });
          onArrive?.(destination);
        },
      });

      timelineRef.current = tl;

      // STAGE 1: DEPARTURE (0.0s - 0.6s)
      // Map gently folds and disappears, brief transition pause
      tl.to(animValues, {
        progress: 0.15,
        speed: 0.05,
        stretch: 0.05,
        duration: departureDuration,
        ease: 'power1.in',
        onStart: () => updateState('departure'),
        onUpdate: () => updateState('departure'),
      });

      // STAGE 2: ACCELERATION (0.6s - 1.6s)
      // Space begins accelerating, stars stretch into motion trails, camera enters wormhole
      tl.to(animValues, {
        progress: 0.45,
        speed: config.peakSpeed,
        stretch: 1.0,
        tunnelOpacity: 0.95,
        fovOffset: 12.0,
        duration: accelDuration,
        ease: 'power2.in',
        onStart: () => updateState('acceleration'),
        onUpdate: () => updateState('acceleration'),
      });

      // STAGE 3: WORMHOLE TRAVEL (1.6s - 3.3s)
      // Full procedural wormhole travel through curved spacetime
      tl.to(animValues, {
        progress: 0.80,
        speed: config.peakSpeed,
        stretch: 1.0,
        tunnelOpacity: 1.0,
        fovOffset: 13.0,
        duration: wormholeDuration,
        ease: 'none',
        onStart: () => updateState('wormhole'),
        onUpdate: () => updateState('wormhole'),
      });

      // STAGE 4: DECELERATION & EXIT (3.3s - 4.2s)
      // Streaks decelerate, tunnel dissolves, exit starlight wash
      tl.to(animValues, {
        progress: 1.0,
        speed: 0.0,
        stretch: 0.0,
        tunnelOpacity: 0.0,
        fovOffset: 0.0,
        duration: decelDuration,
        ease: 'power2.out',
        onStart: () => updateState('deceleration'),
        onUpdate: () => updateState('deceleration'),
      });

      // Simultaneous exit flash pulse during deceleration
      tl.fromTo(
        animValues,
        { exitFlash: 0.0 },
        {
          exitFlash: config.exitIntensity,
          duration: decelDuration * 0.45,
          ease: 'sine.in',
          onUpdate: () => updateState('deceleration'),
        },
        `-=${decelDuration}`
      ).to(animValues, {
        exitFlash: 0.0,
        duration: decelDuration * 0.55,
        ease: 'power2.out',
        onUpdate: () => updateState('deceleration'),
      });
    },
    [reducedMotion, onArrive]
  );

  return {
    travelState,
    startTravel,
    resetTravel,
    isTraveling: travelState.isTraveling,
  };
}
