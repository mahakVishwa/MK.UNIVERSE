import { useSyncExternalStore } from 'react';

export type AboutObjectId = 'education' | 'interests' | 'experience' | 'orbit' | 'skills' | null;

let currentSelectedId: AboutObjectId = null;
const listeners = new Set<() => void>();

export const coreStarStore = {
  get: (): AboutObjectId => currentSelectedId,
  set: (id: AboutObjectId) => {
    if (currentSelectedId !== id) {
      currentSelectedId = id;
      listeners.forEach((listener) => listener());
    }
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

/**
 * Hook to share active celestial object selection between 3D canvas and HTML overlay
 */
export function useCoreStarState(): [AboutObjectId, (id: AboutObjectId) => void] {
  const selected = useSyncExternalStore(coreStarStore.subscribe, coreStarStore.get, () => null);
  return [selected, coreStarStore.set];
}
