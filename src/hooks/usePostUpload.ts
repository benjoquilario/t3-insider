import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { useDropzone } from "@uploadthing/react"
import { useUploadThing } from "@/lib/uploadthing"
import { useToast } from "@/components/ui/use-toast"
import { toast } from "sonner"

export const usePostUpload = () => {
  const [isError, setIsError] = useState(false)
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
        console.log("Success")
      },
      onUploadError: (e) => {
        setIsError(true)
        toast.error(e.message)
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
    [form]
  )
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setImages(acceptedFiles)
    },
    [setImages]
  )

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

  return {
    getRootProps,
    getInputProps,
    form,
    startUpload,
    isUploading,
    isError,
    setIsError,
  }
}
