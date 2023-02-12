import React, { useCallback, useState } from "react";
import NextImage, {
  type ImageProps as NextImageProps,
} from "next/legacy/image";
import { motion } from "framer-motion";
import { variants } from "@/lib/utils/index";

interface ImageProps extends NextImageProps {
  containerclassnames?: string;
}

const Image: React.FC<ImageProps> = ({ onLoadingComplete, ...props }) => {
  const { containerclassnames } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoadingComplete: NextImageProps["onLoadingComplete"] =
    useCallback(
      (result: unknown) => {
        setIsLoaded(true);

        onLoadingComplete?.(result as never);
      },
      [onLoadingComplete]
    );

  return (
    <motion.div
      initial="hidden"
      variants={variants}
      animate={isLoaded ? "visible" : "hidden"}
      className={containerclassnames}
    >
      <NextImage
        onLoadingComplete={handleLoadingComplete}
        unoptimized
        {...props}
      />
    </motion.div>
  );
};

export default Image;
