import React, { useMemo } from "react";
import Image from "next/legacy/image";
import Button from "./button";
import { RiCloseFill } from "react-icons/ri";

type ImageThumbnailProps = {
  image: File;
  removeImage: (imageName: string) => void;
};

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({
  image,
  removeImage,
}) => {
  const src = useMemo(() => URL.createObjectURL(image), [image]);

  return (
    <div className="relative">
      <Button
        onClick={() => removeImage(image.name)}
        className="absolute top-2 right-0 z-50 rounded-full bg-gray-600 p-1 text-white transition duration-75 ease-in hover:bg-gray-700"
      >
        <RiCloseFill aria-hidden="true" size={22} />
      </Button>
      <Image
        src={src}
        layout="responsive"
        width={200}
        height={50}
        objectFit="cover"
        className="rounded-lg"
        alt=""
      />
    </div>
  );
};

export default ImageThumbnail;
