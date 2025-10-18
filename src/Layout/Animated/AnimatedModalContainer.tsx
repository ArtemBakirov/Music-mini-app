import { AnimatedOverlay } from "./AnimatedOverlay.tsx";
import { motion, Variants } from "framer-motion";
import React from "react";

type AnimatedModalContainerProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const dropIn: Variants = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

export const AnimatedModalContainer = ({
  children,
  onClose,
}: AnimatedModalContainerProps) => {
  return (
    <AnimatedOverlay onClose={onClose}>
      <motion.div
        className={
          "bg-[#55356B] w-[70%] h-[70%] flex flex-col items-center m-auto rounded-lg p-4"
        }
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatedOverlay>
  );
};
