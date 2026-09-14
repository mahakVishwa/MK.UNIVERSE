import React from 'react';
import { AstronautCompanion, AstronautCompanionProps } from './AstronautCompanion';

export type PandaCompanionProps = AstronautCompanionProps;

/**
 * PandaCompanion / AstronautCompanion:
 * Modular, replaceable companion component for MK.UNIVERSE.
 * Now renders the Lottie astronaut animation in the stable center-left companion anchor.
 *
 * Preserves exact interface, responsive positioning, subtle zero-g entrance and idle float.
 */
export const PandaCompanion: React.FC<PandaCompanionProps> = (props) => {
  return <AstronautCompanion {...props} />;
};

export default PandaCompanion;
