import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { useDropzone } from "@uploadthing/react"
import { generateClientDropzoneAccept } from "uploadthing/client"
import { useUploadThing } from "@/lib/uploadthing"

export const usePostUpload = () => {
  const form = useForm<IPostValues>({
    defaultValues: {
      content: "",
      selectedFile: [],
    },
  })

  const [files, setFiles] = useState<File[]>([])

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing(
    "mediaPost",
    {
      onClientUploadComplete: () => {
        alert("uploaded successfully!")
      },
      onUploadError: () => {
        alert("error occurred while uploading")
      },
      onUploadBegin: () => {
        alert("upload has begun")
      },
    }
  )

  const setImages = useCallback(
    (files: File[]) => {
      const currentImages = form.getValues("selectedFile")

      if (files?.length + currentImages?.length > 4) {
        return
      }

      const imageToVerify = files.slice(0, 4 - currentImages?.length)

      form.setValue("selectedFile", [
        ...form.getValues("selectedFile"),
        ...imageToVerify,
      ])
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

  const selectedImages = form.watch("selectedFile")

  return { getRootProps, getInputProps, form, startUpload, isUploading }
}
