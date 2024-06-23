import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { useDropzone } from "@uploadthing/react"
import { generateClientDropzoneAccept } from "uploadthing/client"
import { useUploadThing } from "@/lib/uploadthing"

interface ProfileValues {
  images: File[]
}

export const useUploadProfile = () => {
  const form = useForm<ProfileValues>({
    defaultValues: {
      images: [],
    },
  })

  const [files, setFiles] = useState<File[]>([])

  const { startUpload, permittedFileInfo, isUploading } =
    useUploadThing("mediaPost")

  const setImages = useCallback(
    (files: File[]) => {
      const currentImages = form.getValues("images")

      if (files?.length + currentImages?.length > 4) {
        return
      }

      const imageToVerify = files.slice(0, 4 - currentImages?.length)

      form.setValue("images", [...form.getValues("images"), ...imageToVerify])
    },
    [form.getValues, form.setValue]
  )
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
  })

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : []

  const selectedImages = form.watch("images")

  return { getRootProps, getInputProps, form, startUpload, isUploading }
}
