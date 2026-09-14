import { Destination, DestinationId } from './navigation';

/**
 * Stages of physical wormhole space travel:
 * 1. idle: resting in galaxy / map view
 * 2. departure: map gently folds/disappears, short transition pause
 * 3. acceleration: space begins accelerating, stars stretch into motion trails
 * 4. wormhole: camera enters procedural wormhole, travels through curved spacetime
 * 5. deceleration: tunnel expands, streaks compress, soft starlight wash
 * 6. arrival: exit into destination placeholder environment
 */
export type TravelPhase =
  | 'idle'
  | 'departure'
  | 'acceleration'
  | 'wormhole'
  | 'deceleration'
  | 'arrival';

/**
 * Reusable destination-specific wormhole configuration.
 * All destinations share the procedural wormhole engine while adopting
 * restrained, destination-specific cosmic palettes and motion dynamics.
 */
export interface DestinationTravelConfig {
  readonly destinationId: DestinationId;
  /** Base travel duration in seconds (for normal motion) */
  readonly duration: number;
  /** Number of streaking star filaments */
  readonly streakCount: number;
  /** Peak travel velocity multiplier */
  readonly peakSpeed: number;
  /** Gravitational swirl / spacetime curvature factor */
  readonly twist: number;
  /** Procedural tunnel radius */
  readonly tunnelRadius: number;
  /** Primary starlight color (warm starlight / ivory palette) */
  readonly primaryColor: string;
  /** Secondary starlight / subtle nebula hue */
  readonly secondaryColor: string;
  /** Accent stardust tone */
  readonly accentColor: string;
  /** Exit starlight intensity (0.0 to 1.0) */
  readonly exitIntensity: number;
}

/**
 * Live travel state passed to 3D canvas and overlay components.
 */
export interface TravelState {
  readonly phase: TravelPhase;
  readonly activeDestination: Destination | null;
  readonly isTraveling: boolean;
  /** Normalized overall sequence progress (0.0 to 1.0) */
  readonly progress: number;
  /** Dynamic velocity (0.0 to 1.0) controlling particle streak speed */
  readonly speed: number;
  /** Elongation factor for star streaks (0.0 to 1.0) */
  readonly stretch: number;
  /** Spacetime tunnel visibility / opacity (0.0 to 1.0) */
  readonly tunnelOpacity: number;
  /** Exit starlight flash / bloom factor (0.0 to 1.0) */
  readonly exitFlash: number;
  /** Camera FOV offset during acceleration (0 to 14 degrees) */
  readonly fovOffset: number;
}
