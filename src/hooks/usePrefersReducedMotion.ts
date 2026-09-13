import { useState, useEffect } from 'react';

/**
 * Hook to detect the user's OS / browser reduced motion preference.
 * Listens for system changes dynamically and returns the current boolean preference.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', updateMotionPreference);
    return () => {
      mediaQuery.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  return prefersReducedMotion;
}
