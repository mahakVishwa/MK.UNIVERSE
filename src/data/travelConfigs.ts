import { DestinationId } from '../types/navigation';
import { DestinationTravelConfig } from '../types/travel';

/**
 * Procedural wormhole configurations for all 5 celestial destinations.
 * Adheres strictly to a restrained, warm/dark cosmic palette:
 * - Void background: #040508
 * - Warm starlight ivory: #f3ebdd
 * - Champagne starlight: #c9b78f
 * - Soft ivory & dusty rose: #d9d2c5 & #6f555e
 * Zero neon cyan, zero neon purple, zero game HUDs, zero portal doors.
 */
export const DESTINATION_TRAVEL_CONFIGS: Record<DestinationId, DestinationTravelConfig> = {
  about: {
    destinationId: 'about',
    duration: 4.2,
    streakCount: 1400,
    peakSpeed: 1.0,
    twist: 0.65,
    tunnelRadius: 3.2,
    primaryColor: '#f3ebdd',   // Warm star-white
    secondaryColor: '#eed9aa', // Soft golden core tone
    accentColor: '#e0b672',    // Warm stellar ember
    exitIntensity: 0.85,       // Warm gentle stellar arrival
  },
  skills: {
    destinationId: 'skills',
    duration: 4.0,
    streakCount: 1350,
    peakSpeed: 0.95,
    twist: 0.9,
    tunnelRadius: 3.1,
    primaryColor: '#f3ebdd',   // Warm starlight
    secondaryColor: '#c9b78f', // Champagne starlight
    accentColor: '#a8926a',    // Muted planetary bronze
    exitIntensity: 0.70,
  },
  projects: {
    destinationId: 'projects',
    duration: 4.4,
    streakCount: 1500,
    peakSpeed: 1.05,
    twist: 1.15,
    tunnelRadius: 3.4,
    primaryColor: '#d9d2c5',   // Soft ivory
    secondaryColor: '#a58992', // Dusty rose stardust
    accentColor: '#6f555e',    // Deep cosmic plum
    exitIntensity: 0.78,
  },
  timeline: {
    destinationId: 'timeline',
    duration: 4.3,
    streakCount: 1380,
    peakSpeed: 0.98,
    twist: 0.55,
    tunnelRadius: 3.0,
    primaryColor: '#f3ebdd',   // Warm starlight
    secondaryColor: '#c9b78f', // Antique celestial brass
    accentColor: '#8c7b58',    // Deep starlight bronze
    exitIntensity: 0.72,
  },
  contact: {
    destinationId: 'contact',
    duration: 3.9,
    streakCount: 1300,
    peakSpeed: 1.0,
    twist: 0.75,
    tunnelRadius: 3.2,
    primaryColor: '#f3ebdd',   // Beacon starlight
    secondaryColor: '#8a89a6', // Dusk twilight starlight
    accentColor: '#4d4c6a',    // Deep quiet stardust
    exitIntensity: 0.80,
  },
};

export const DEFAULT_TRAVEL_CONFIG: DestinationTravelConfig = DESTINATION_TRAVEL_CONFIGS.about;

export function getTravelConfigForDestination(id: DestinationId): DestinationTravelConfig {
  return DESTINATION_TRAVEL_CONFIGS[id] ?? DEFAULT_TRAVEL_CONFIG;
}
