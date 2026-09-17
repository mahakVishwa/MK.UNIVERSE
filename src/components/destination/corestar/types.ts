export type DepthLevel = 1 | 2 | 3 | 4;

export type LayerRole =
  | 'background'
  | 'orbit'
  | 'sun'
  | 'crystal'
  | 'asteroid'
  | 'comet'
  | 'ground';

export type LayerLayoutType = 'background' | 'centered' | 'bottom-aligned';

export interface ParallaxLayerConfig {
  /** Unique semantic identifier for the layer (e.g. 'corestar-asteroid') */
  id: string;
  /** Human-readable name of the celestial asset */
  name: string;
  /** Primary depth level (1: Furthest, 2: Midground, 3: Main Subject, 4: Foreground) */
  depthLevel: DepthLevel;
  /** Specific celestial role */
  role: LayerRole;
  /** How this layer is positioned in neutral composition */
  layoutType: LayerLayoutType;
  /** Normalized horizontal center coordinate (0.0 = left, 0.5 = center, 1.0 = right) */
  centerX?: number;
  /** Normalized vertical center coordinate (0.0 = top, 0.5 = center, 1.0 = bottom) */
  centerY?: number;
  /** Independent viewport-relative width in vw */
  widthVw?: number;
  /** Optional bottom offset in vh for bottom-aligned layers (e.g. -7 to shift lower) */
  bottomOffsetVh?: number;
  /** Target visible width in vw (for documentation/reference) */
  visibleWidthVw?: number;
  /** Path to the exact provided PNG asset */
  src: string;
  /** Accessible description (empty string if purely decorative / aria-hidden) */
  alt: string;
  /** Stacking order to ensure physical depth relationship */
  zIndex: number;
  /** Relative parallax movement strength (normalized against base foreground displacement) */
  parallaxRatio: number;
  /** Relative vertical parallax multiplier (optional fine-tuning) */
  parallaxRatioY?: number;
  /** Whether this foreground element is an interactive target for future phases */
  isInteractiveTarget?: boolean;
}

export interface ParallaxSceneProps {
  layers?: readonly ParallaxLayerConfig[];
  reducedMotion?: boolean;
  className?: string;
  onLayerSelect?: (layerId: string) => void;
}
