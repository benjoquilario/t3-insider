import React, { useState } from "react"
import { useWatch, type Control, type UseFormSetValue } from "react-hook-form"
import type { PostValues } from "../form/post"
import { HiPhoto } from "react-icons/hi2"
import { RiCloseFill } from "react-icons/ri"
import ImageThumbnail from "@/components/shared/image-thumbnail"
import Image from "@/components/shared/image"
import classNames from "classnames"
import type { SelectedFileType } from "@/types/types"
import Button from "@/components/shared/button"
import usePostStore from "@/store/post"

interface PostInputProps {
  control: Control<PostValues>
  setValue: UseFormSetValue<PostValues>
  openFilePicker: () => void
  children: React.ReactNode
  disabled?: boolean
  selectedFile?: SelectedFileType[]
}

const PostInput: React.FC<PostInputProps> = ({
  control,
  setValue,
  openFilePicker,
  children,
  disabled,
  selectedFile,
}) => {
  const setIsRemove = usePostStore((store) => store.setIsRemove)
  const [currentImages, setCurrentImages] = useState<
    SelectedFileType[] | undefined
  >(selectedFile)
  const setDeleteImages = usePostStore((store) => store.setDeleteImages)
  const selectedImage = useWatch({
    control,
    name: "selectedFile",
    defaultValue: [],
  })

  const removeImage = (imageName: string) => {
    setValue(
      "selectedFile",
      selectedImage.filter((image) => image.name !== imageName)
    )
  }

  const handleRemove = (id: string) => {
    setDeleteImages(id)
    setIsRemove(true)
    const removeItem = currentImages?.filter((image) => image.id !== id)

    setCurrentImages(removeItem)
  }

  return (
    <div className="rounded-b-md bg-white p-3">
      <div
        className={classNames(
          " relative overflow-auto",
          currentImages?.length || selectedImage.length ? "h-56" : ""
        )}
      >
        {currentImages?.length
          ? currentImages?.map((image, index) => (
              <div className={classNames("relative")} key={index}>
                <Button
                  type="button"
                  onClick={() => handleRemove(image.id)}
                  className="absolute right-0 top-2 z-50 rounded-full bg-gray-600 p-1 text-white transition duration-75 ease-in hover:bg-gray-700"
                >
                  <RiCloseFill aria-hidden="true" size={22} />
                </Button>
                <div className={classNames("relative")}>
                  <Image
                    src={image.url}
                    layout="responsive"
                    width={image.width}
                    height={image.height}
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
              return (
                <ImageThumbnail
                  key={index}
                  image={image}
                  removeImage={removeImage}
                />
              )
            })
          : null}
      </div>

      <div className="flex items-center gap-4 rounded border border-zinc-200 px-2 py-2">
        <p className="text-sm text-black md:text-sm">Upload Photo :</p>
        <div className="overflow-hidden rounded-full p-1 text-xs text-white transition hover:bg-zinc-100 md:text-sm">
          <button
            className="flex h-5 w-8 cursor-pointer items-center justify-center text-black"
            onClick={openFilePicker}
            type="button"
            disabled={disabled}
          >
            <HiPhoto className="h-8 w-8" />
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}

export default PostInput
