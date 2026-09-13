/**
 * Configuration parameters for the procedural Arrival Galaxy.
 * Final Phase 3.1 visual calibration:
 * Subdued core with slightly enhanced spiral arm starlight presence.
 */
export interface GalaxyConfig {
  readonly particleCount: number;
  readonly galaxyRadius: number;
  readonly arms: number;
  readonly armWinding: number;
  readonly power: number;
  readonly coreRadius: number;
  readonly coreParticleScale: number;
  readonly coreLuminanceCap: number;
  readonly discThickness: number;
  readonly randomness: number;
  readonly particleSize: number;
  readonly rotationSpeed: number;
  readonly coreColor: string;
  readonly armColor: string;
  readonly haloColor: string;
  readonly arrivalDuration: number;
  readonly textRevealThreshold: number;
}

export const DEFAULT_GALAXY_CONFIG: GalaxyConfig = {
  particleCount: 25000,
  galaxyRadius: 5.6,
  arms: 3,
  armWinding: 3.2,
  power: 1.75,               // Smooth arm distribution without central pile-up
  coreRadius: 0.65,          // Preserves comfortable negative space at core
  coreParticleScale: 0.42,   // Fine stardust pinpoints at center
  coreLuminanceCap: 0.30,    // Subdued, dim and distant core
  discThickness: 0.48,
  randomness: 0.34,
  particleSize: 17.0,        // Slightly enhanced starlight presence across arms
  rotationSpeed: 0.022,      // Very gentle, quiet celestial drift
  coreColor: '#F3EBDD',      // Warm star-white
  armColor: '#C9B78F',       // Faint champagne
  haloColor: '#29283A',      // Smoky indigo
  arrivalDuration: 3.5,
  textRevealThreshold: 0.70,
};
