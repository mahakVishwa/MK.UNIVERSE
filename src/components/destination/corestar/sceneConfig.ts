import { ParallaxLayerConfig } from './types';

/**
 * THE CORE STAR — COMPOSITION & 2.5D PARALLAX CONFIGURATION
 *
 * Each asset has an independent viewport-relative scale and normalized center,
 * calibrated against the attached Composition Reference:
 *
 * Layer Order (Furthest → Closest):
 * 1. Dark Cosmic Background  (Depth 1, z-10, Parallax: 0.075x) — Full viewport overscan
 * 2. Orbit + Solar Flare     (Depth 2, z-20, Parallax: 0.20x)  — Center: (0.50, 0.48), Visible Width: ~70% vw
 * 3. Central Sun             (Depth 3, z-30, Parallax: 0.45x)  — Center: (0.50, 0.48), Visible Width: ~28% vw
 * 4. Foreground Ground       (Depth 4, z-40, Parallax: 1.00x)  — Bottom aligned, Width: ~110% vw
 * 5. Crystal                 (Depth 4, z-50, Parallax: 1.03x)  — Center: (0.22, 0.62), Visible Width: ~15% vw
 * 6. Asteroid                (Depth 4, z-52, Parallax: 1.06x)  — Center: (0.82, 0.58), Visible Width: ~12% vw
 * 7. Comet                   (Depth 4, z-54, Parallax: 1.10x)  — Center: (0.78, 0.28), Visible Width: ~24% vw
 */
export const CORE_STAR_LAYERS: readonly ParallaxLayerConfig[] = [
  // 1. BACKGROUND — FURTHEST
  {
    id: 'corestar-background',
    name: 'Dark Cosmic Background',
    depthLevel: 1,
    role: 'background',
    layoutType: 'background',
    src: '/assets/corestar/scene/background.png',
    alt: '',
    zIndex: 10,
    parallaxRatio: 0.075, // 7.5% movement (almost stationary)
    parallaxRatioY: 0.075,
    isInteractiveTarget: false,
  },
  // 2. ORBIT + SOLAR FLARE — MIDGROUND
  {
    id: 'corestar-orbit',
    name: 'Orbit and Solar Flare Structure',
    depthLevel: 2,
    role: 'orbit',
    layoutType: 'centered',
    centerX: 0.50,
    centerY: 0.48,
    visibleWidthVw: 70,
    widthVw: 75.1, // Compensates for 93.2% artwork-to-canvas ratio
    src: '/assets/corestar/scene/orbit.png',
    alt: '',
    zIndex: 20,
    parallaxRatio: 0.20, // 20% movement
    parallaxRatioY: 0.20,
    isInteractiveTarget: false,
  },
  // 3. SUN — MAIN SUBJECT
  {
    id: 'corestar-sun',
    name: 'The Central Sun',
    depthLevel: 3,
    role: 'sun',
    layoutType: 'centered',
    centerX: 0.50,
    centerY: 0.48,
    visibleWidthVw: 28,
    widthVw: 29.8, // Compensates for 94.1% artwork-to-canvas ratio
    src: '/assets/corestar/scene/sun.png',
    alt: '',
    zIndex: 30,
    parallaxRatio: 0.45, // 45% movement
    parallaxRatioY: 0.45,
    isInteractiveTarget: false,
  },
  // 4. FOREGROUND GROUND — CLOSEST ENVIRONMENT
  {
    id: 'corestar-ground',
    name: 'Foreground Ground and Rock Formation',
    depthLevel: 4,
    role: 'ground',
    layoutType: 'bottom-aligned',
    widthVw: 110, // 110% vw for overscan
    bottomOffsetVh: -7, // Shifted lower by 7% vh to frame the lower edge cleanly
    src: '/assets/corestar/scene/ground.png',
    alt: '',
    zIndex: 40,
    parallaxRatio: 1.00, // 100% foreground movement
    parallaxRatioY: 1.00,
    isInteractiveTarget: false,
  },
  // 5. CRYSTAL — CLOSE FOREGROUND
  {
    id: 'corestar-crystal',
    name: 'Crystalline Formation',
    depthLevel: 4,
    role: 'crystal',
    layoutType: 'centered',
    centerX: 0.22,
    centerY: 0.56, // Shifted upwards from 0.62 for clearance above foreground crags
    visibleWidthVw: 15,
    widthVw: 16.0, // Compensates for 93.9% artwork-to-canvas ratio
    src: '/assets/corestar/scene/crystal.png',
    alt: '',
    zIndex: 50,
    parallaxRatio: 1.03, // 103% movement
    parallaxRatioY: 1.03,
    isInteractiveTarget: true,
  },
  // 6. ASTEROID — CLOSE FOREGROUND
  {
    id: 'corestar-asteroid',
    name: 'Faceted Asteroid',
    depthLevel: 4,
    role: 'asteroid',
    layoutType: 'centered',
    centerX: 0.82,
    centerY: 0.52, // Shifted upwards from 0.58 for clearance above foreground crags
    visibleWidthVw: 12,
    widthVw: 30.8, // Compensates for 39.0% artwork-to-canvas ratio
    src: '/assets/corestar/scene/asteroid.png',
    alt: '',
    zIndex: 52,
    parallaxRatio: 1.06, // 106% movement
    parallaxRatioY: 1.06,
    isInteractiveTarget: true,
  },
  // 7. COMET — CLOSE FOREGROUND
  {
    id: 'corestar-comet',
    name: 'Speeding Comet',
    depthLevel: 4,
    role: 'comet',
    layoutType: 'centered',
    centerX: 0.765, // Positioned so visible artwork center lands at (0.78, 0.22)
    centerY: 0.21, // Shifted upwards from 0.27
    visibleWidthVw: 24,
    widthVw: 36.9, // Compensates for 65.1% artwork-to-canvas ratio
    src: '/assets/corestar/scene/comet.png',
    alt: '',
    zIndex: 54,
    parallaxRatio: 1.10, // 110% movement
    parallaxRatioY: 1.10,
    isInteractiveTarget: true,
  },
] as const;

/**
 * Parallax movement parameters:
 * Movement is smooth, subtle, and cinematic.
 */
export const PARALLAX_SETTINGS = {
  /** Base horizontal displacement in px for 1.00x foreground at 1080p */
  baseDisplacementX: 42,
  /** Base vertical displacement in px for 1.00x foreground at 1080p */
  baseDisplacementY: 26,
  /** RAF interpolation damping factor */
  lerpFactor: 0.055,
  /** Camera 3D perspective rotation around Y (degrees) */
  cameraTiltX: 0.8,
  /** Camera 3D perspective rotation around X (degrees) */
  cameraTiltY: 0.6,
  /** Camera perspective distance in px */
  perspectivePx: 1400,
  /** Background overscan expansion */
  backgroundOverscanPercent: 7,
} as const;
