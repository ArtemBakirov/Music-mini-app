import { Transition } from "framer-motion";

export const MARKER_ANIMATION: Transition = {
  exit: { opacity: 1, y: 20, scale: 0 },
  initial: { opacity: 1, y: 20, scale: 0.7 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

export const SPRING_ANIMATION: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
};
export const MENU_SPRING_ANIMATION: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
};
