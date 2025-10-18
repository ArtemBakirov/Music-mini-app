import { motion } from "framer-motion";
import React from "react";

type AnimatedOverlayProps = {
  onClose: () => void;
  children: React.ReactNode;
};

export const AnimatedOverlay = ({
  children,
  onClose,
}: AnimatedOverlayProps) => {
  return (
    <motion.div
      onClick={onClose}
      className={
        "h-full w-full border-black border-1 absolute top-0 left-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center"
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};
