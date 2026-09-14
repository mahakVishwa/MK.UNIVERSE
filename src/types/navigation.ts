/**
 * Navigation and guide interaction types for MK.UNIVERSE Phase 3.
 */

export type DestinationId = 'about' | 'skills' | 'projects' | 'timeline' | 'contact';

export type DestinationType =
  | 'sun-core'
  | 'solar-system'
  | 'nebula'
  | 'time-machine'
  | 'transmission-station';

export interface Destination {
  readonly id: DestinationId;
  readonly label: string;
  readonly type: DestinationType;
  readonly symbol: string;
  readonly title: string;
  readonly description: string;
  readonly themeColor: string;
  /** Normalized coordinates (percentage 0 - 100) on the celestial star chart */
  readonly chartCoords: { x: number; y: number };
  /** Available for selection */
  readonly available: boolean;
  /** Hidden destinations (e.g. Black Hole) MUST never be shown on the map */
  readonly hidden?: boolean;
}

export type NavigationMode = 'guided' | 'explore';

export type InteractionPhase =
  | 'arrival'       // Arrival galaxy & initial welcome message
  | 'guide-intro'   // Guide companion enters & dialogue proceeds
  | 'map-reveal'    // Holographic star chart expands
  | 'mode-select'   // User selects Guided Tour vs Explore Freely
  | 'active'        // Active mode; destination selection enabled
  | 'traveling'     // Wormhole travel transition underway
  | 'destination';  // Arrived at destination placeholder environment

export interface GuideDialogueStep {
  readonly id: number;
  readonly text: string;
  readonly prompt?: string;
}
