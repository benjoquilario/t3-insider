"use client"

import React, { useCallback } from "react"
import Image from "next/image"
import { AiFillCamera } from "react-icons/ai"
import { cn } from "@/lib/utils"
import { useDropzone } from "@uploadthing/react"
import { generateClientDropzoneAccept } from "uploadthing/client"
import { ImSpinner3 } from "react-icons/im"
import { useUpdateDataMutation } from "@/hooks/useUpdateDataMutation"
import { useUploadThing } from "@/lib/uploadthing"
import { useSession } from "next-auth/react"
import { buttonVariants } from "@/components/ui/button"
import { variants } from "@/lib/variants"

type CoverPhotoProps = {
  photoUrl?: string
  userId: string
}

const CoverPhoto = (props: CoverPhotoProps) => {
  const { photoUrl, userId } = props
  const { data: session } = useSession()
  const { updateCoverPhoto } = useUpdateDataMutation(userId)

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing(
    "coverPhoto",
    {
      onClientUploadComplete: (res) => {
        alert("uploaded successfully!")
        updateCoverPhoto.mutate({ url: res[0].url })
      },
    }
  )

  const onDrop = useCallback((acceptedFiles: File[]) => {
    startUpload(acceptedFiles)
  }, [])

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : []

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  })
  return (
    <div
      className="relative h-56 w-full overflow-hidden bg-white shadow"
      // {...getRootCoverProps}
    >
      <div className="size-full">
        <div className="relative h-56 w-full">
          <Image
            src={photoUrl ?? "/cover.svg"}
            alt="profile"
            layout="fill"
            objectFit="cover"
            // containerclassnames="h-56 w-full relative"
          />
        </div>
        {userId === session?.user.id && (
          <div {...getRootProps()}>
            <div
              className={cn(
                "absolute bottom-3 right-3 flex size-8 items-center justify-center gap-1 rounded-full px-1 text-foreground md:w-32 md:rounded-md",
                "cursor-pointer",
                "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                "items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              <input {...getInputProps()} disabled={isUploading} />
              {isUploading ? (
                <ImSpinner3 className="size-3 animate-spin" />
              ) : (
                <AiFillCamera className="size-3" />
              )}
              <span className="hidden text-xs md:block">Edit cover photo</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoverPhoto
