import React, { Component, ErrorInfo, ReactNode, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ViewportCamera } from './ViewportCamera';
import { ArrivalGalaxy } from './galaxy/ArrivalGalaxy';
import { CanvasFallback } from '../common/CanvasFallback';
import { ProceduralWormhole } from './wormhole/ProceduralWormhole';
import { DestinationEnvironment } from './destination/DestinationEnvironment';
import { CoreStarEnvironment } from './corestar/CoreStarEnvironment';
import { TravelState } from '../../types/travel';
import { Destination, InteractionPhase } from '../../types/navigation';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: (error: Error) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[MK.UNIVERSE 3D Canvas Error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error);
    }
    return this.props.children;
  }
}

interface SceneCanvasProps {
  reducedMotion: boolean;
  onGalaxyFormed?: () => void;
  warmthBoost?: boolean;
  travelState?: TravelState;
  currentPhase?: InteractionPhase;
  activeDestination?: Destination | null;
}

/**
 * SceneCanvas: Pure cosmic 3D canvas container.
 * Hosts:
 * - Quiet, dreamy procedural Arrival Galaxy
 * - Procedural wormhole travel system (acceleration, streaks, curved spacetime tunnel, horizon)
 * - Minimal destination placeholder starlight environment
 * - Responsive camera with subtle pointer parallax
 */
export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  reducedMotion,
  onGalaxyFormed,
  warmthBoost = false,
  travelState,
  currentPhase = 'arrival',
  activeDestination = null,
}) => {
  const isTraveling = travelState?.isTraveling ?? false;
  const isAtDestination = currentPhase === 'destination';
  // Galaxy is visible during arrival/initial exploration and brief departure pause
  const isGalaxyVisible = !isAtDestination && (!isTraveling || travelState?.phase === 'departure');

  return (
    <CanvasErrorBoundary
      fallback={(error) => <CanvasFallback error={error} />}
    >
      <div className="relative h-full w-full bg-[#040508]">
        <Suspense fallback={<CanvasFallback />}>
          <Canvas
            dpr={[1, 2]}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
            }}
            className="h-full w-full"
          >
            {/* Dreamy deep near-black cosmic background */}
            <color attach="background" args={['#040508']} />

            {/* Subtle starlight ambient lighting */}
            <ambientLight intensity={0.3} />

            {/* Responsive camera with subtle pointer parallax (disabled during wormhole warp) */}
            <ViewportCamera reducedMotion={reducedMotion || isTraveling} />

            {/* Dreamy procedural Arrival Galaxy */}
            <group visible={isGalaxyVisible}>
              <ArrivalGalaxy
                reducedMotion={reducedMotion}
                onGalaxyFormed={onGalaxyFormed}
                warmthBoost={warmthBoost}
              />
            </group>

            {/* Procedural Wormhole Travel Engine */}
            {travelState && (
              <ProceduralWormhole
                travelState={travelState}
                reducedMotion={reducedMotion}
              />
            )}

            {/* Destination Environment (The Core Star / About or minimal placeholder) */}
            {isAtDestination && (
              activeDestination?.id === 'about' ? (
                <CoreStarEnvironment
                  destination={activeDestination}
                  reducedMotion={reducedMotion}
                />
              ) : (
                <DestinationEnvironment
                  destination={activeDestination}
                  reducedMotion={reducedMotion}
                />
              )
            )}
          </Canvas>
        </Suspense>
      </div>
    </CanvasErrorBoundary>
  );
};
