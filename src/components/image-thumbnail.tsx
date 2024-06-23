"use client"

import React, { useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { RiCloseFill } from "react-icons/ri"

type ImageThumbnailProps = {
  image: File
  removeImage: (imageName: string) => void
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({
  image,
  removeImage,
}) => {
  const src = useMemo(() => URL.createObjectURL(image), [image])

  return (
    <div className="relative">
      <Button
        type="button"
        size="icon"
        onClick={() => removeImage(image.name)}
        className="absolute right-1 top-2 z-50 rounded-full bg-foreground transition duration-75 ease-in hover:bg-gray-700"
      >
        <RiCloseFill aria-hidden="true" size={22} />
      </Button>
      <div className="relative h-40 w-full">
        <Image
          src={src}
          style={{ objectFit: "cover" }}
          className="rounded-lg"
          alt=""
          fill
        />
      </div>
    </div>
  )
}

export default ImageThumbnail
