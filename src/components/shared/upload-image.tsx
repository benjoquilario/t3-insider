import React from "react"
import { useWatch, type Control, type UseFormSetValue } from "react-hook-form"
import type { PostValues } from "../form/post"
import { HiPhoto } from "react-icons/hi2"
import ImageThumbnail from "./image-thumbnail"

interface UploadImageProps {
  control: Control<PostValues>
  setValue: UseFormSetValue<PostValues>
  openFilePicker: () => void
  disabled?: boolean
}

const UploadImage: React.FC<UploadImageProps> = ({
  control,
  setValue,
  openFilePicker,
  disabled,
}) => {
  const selectedFile = useWatch({
    control,
    name: "selectedFile",
    defaultValue: [],
  })

  console.log(selectedFile)

  const removeImage = (imageName: string) => {
    setValue(
      "selectedFile",
      selectedFile.filter((image) => image.name !== imageName)
    )
  }

  return (
    <React.Fragment>
      <button
        className="flex h-10 w-10 cursor-pointer items-center justify-center text-black"
        onClick={openFilePicker}
        type="button"
        disabled={disabled}
      >
        <HiPhoto className="h-8 w-8" />
      </button>
      <div className="relative">
        {selectedFile.length > 0 &&
          selectedFile?.map((image, index) => {
            return (
              <ImageThumbnail
                key={index}
                image={image}
                removeImage={removeImage}
              />
            )
          })}
      </div>
    </React.Fragment>
  )
}

export default UploadImage
