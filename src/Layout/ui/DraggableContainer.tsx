import React from "react";

import { motion } from "framer-motion";

type DraggableContainerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const DraggableContainer = ({
  isOpen,
  onClose,
  children,
}: DraggableContainerProps) => {
  return <>{isOpen && <motion.div>{children}</motion.div>}</>;
};
