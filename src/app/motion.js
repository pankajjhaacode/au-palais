import { useReducedMotion } from 'framer-motion';

/** Motion distance multiplier: subtle by default, none when the visitor prefers reduced motion. */
export function useMotionScale() {
  return useReducedMotion() ? 0 : 0.45;
}
