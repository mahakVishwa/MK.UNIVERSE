import { Destination } from '../types/navigation';

/**
 * Celestial landmarks of MK.UNIVERSE.
 * Designed as places in a quiet, dreamlike cosmos.
 * NOTE: The hidden Black Hole dimension is intentionally omitted from the visible star chart.
 */
export const VISIBLE_DESTINATIONS: readonly Destination[] = [
  {
    id: 'about',
    label: 'About',
    type: 'sun-core',
    symbol: '☀',
    title: 'The Core Star',
    description: 'Where ideas begin; thoughts on code, craft and origins.',
    themeColor: '#f3ebdd', // Warm starlight
    chartCoords: { x: 50, y: 30 },
    available: true,
  },
  {
    id: 'skills',
    label: 'Skills',
    type: 'solar-system',
    symbol: '🪐',
    title: 'Planetary System',
    description: 'Familiar worlds of frontend, 3D space, and quiet systems.',
    themeColor: '#c9b78f', // Champagne starlight
    chartCoords: { x: 26, y: 55 },
    available: true,
  },
  {
    id: 'projects',
    label: 'Projects',
    type: 'nebula',
    symbol: '✦',
    title: 'Luminous Nebula',
    description: 'Constellations of things built, explored, and set adrift.',
    themeColor: '#d9d2c5', // Soft ivory
    chartCoords: { x: 74, y: 52 },
    available: true,
  },
  {
    id: 'timeline',
    label: 'Timeline',
    type: 'time-machine',
    symbol: '⏳',
    title: 'River of Time',
    description: 'Footprints across the years, quiet milestones, and echoes.',
    themeColor: '#c9b78f', // Muted celestial
    chartCoords: { x: 38, y: 78 },
    available: true,
  },
  {
    id: 'contact',
    label: 'Contact',
    type: 'transmission-station',
    symbol: '📡',
    title: 'The Whispering Star',
    description: 'Send a signal across the void; words always find a way.',
    themeColor: '#f3ebdd', // Distant beacon
    chartCoords: { x: 64, y: 80 },
    available: true,
  },
] as const;

export const GUIDE_DIALOGUES = [
  {
    id: 0,
    text: "Oh! You're here.",
    prompt: "Listen",
  },
  {
    id: 1,
    text: "I was wondering when you'd show up.",
    prompt: "Listen",
  },
  {
    id: 2,
    text: "This place is bigger than it looks.",
    prompt: "Listen",
  },
  {
    id: 3,
    text: "Come on... I'll show you around.",
    prompt: "Unfold Star Chart ✦",
  },
] as const;
