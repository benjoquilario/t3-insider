"use client"

import React, { useState } from "react"
import { useWatch, type Control, type UseFormSetValue } from "react-hook-form"
import ImageThumbnail from "@/components/image-thumbnail"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { RiCloseFill } from "react-icons/ri"

type PostUploadProps = {
  control: Control<IPostValues>
  setValue: UseFormSetValue<IPostValues>
  children: React.ReactNode
  disabled?: boolean
  selectedFile?: ISelectedFile[]
}

const PostUpload: React.FC<PostUploadProps> = (props) => {
  const { control, setValue, children, disabled, selectedFile } = props

  const [currentImages, setCurrentImages] = useState<
    ISelectedFile[] | undefined
  >(selectedFile)

  const selectedImage = useWatch({
    control,
    name: "selectedFile",
    defaultValue: [],
  })

  return (
    <>
      {currentImages?.length
        ? currentImages?.map((image, index) => (
            <div className="relative" key={index}>
              <Button
                type="button"
                className="absolute right-0 top-2 z-50 rounded-full bg-gray-600 p-1 text-white transition duration-75 ease-in hover:bg-gray-700"
              >
                <RiCloseFill aria-hidden="true" size={22} />
              </Button>
              <div className={cn("relative")}>
                <Image
                  src={image.url}
                  layout="responsive"
                  objectFit="cover"
                  className="rounded-lg"
                  alt=""
                />
              </div>
            </div>
          ))
        : null}

      {selectedImage.length
        ? selectedImage?.map((image, index) => {
            return <ImageThumbnail key={index} image={image} />
          })
        : null}
      {children}
    </>
  )
}

export default PostUpload
