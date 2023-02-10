import { AnimatePresence, motion } from "framer-motion";
import { backdropVariant } from "@/utils/index";
import React from "react";

type BackdropProps = {
  children: React.ReactNode;
};

const Backdrop = React.forwardRef<HTMLDivElement, BackdropProps>(
  (props, ref) => (
    <AnimatePresence>
      <motion.div
        variants={backdropVariant}
        initial="hidden"
        animate="visible"
        exit="hidden"
        ref={ref}
        className="fixed top-0 left-0 z-50 flex min-h-screen w-full animate-[opacity_0.5s_ease-in-out] items-center justify-center bg-gradient-to-r from-[#00000080] to-[#00000080]"
      >
        {props.children}
      </motion.div>
    </AnimatePresence>
  )
);

Backdrop.displayName = "Backdrop";

export default Backdrop;
