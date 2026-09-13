/**
 * Scene identifiers representing planned phases of the MK.UNIVERSE portfolio.
 * Only the project foundation is implemented in Phase 1.
 * These types establish a scalable structure for future scenes without premature code.
 */
export type SceneId =
  | 'arrival'
  | 'guide'
  | 'map'
  | 'about'
  | 'skills'
  | 'projects'
  | 'timeline'
  | 'contact'
  | 'blackHole';

export interface SceneMeta {
  readonly id: SceneId;
  readonly label: string;
  readonly description: string;
}

export const PLANNED_SCENES: readonly SceneMeta[] = [
  { id: 'arrival', label: 'Arrival', description: 'Orbital landing and welcome gate' },
  { id: 'guide', label: 'Guide', description: 'Flight controls and celestial navigation' },
  { id: 'map', label: 'Map', description: 'Interactive galaxy map overview' },
  { id: 'about', label: 'About', description: 'Core star — identity, mission & philosophy' },
  { id: 'skills', label: 'Skills', description: 'Solar system of technical proficiencies' },
  { id: 'projects', label: 'Projects', description: 'Nebular deep-space showcase' },
  { id: 'timeline', label: 'Timeline', description: 'Chronological time-warp journey' },
  { id: 'contact', label: 'Contact', description: 'Deep space transmission relay' },
  { id: 'blackHole', label: 'Black Hole', description: 'Singularity secret dimension' },
] as const;
