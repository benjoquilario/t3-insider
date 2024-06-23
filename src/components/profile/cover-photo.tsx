"use client"

import React, { useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AiFillCamera } from "react-icons/ai"
import { cn } from "@/lib/utils"
import { useDropzone } from "@uploadthing/react"
import { generateClientDropzoneAccept } from "uploadthing/client"
import { updateProfilePicture } from "@/server/user"
import { ImSpinner3 } from "react-icons/im"
import { useUpdateDataMutation } from "@/hooks/useUpdateDataMutation"
import { useSession } from "next-auth/react"
import { useQueryUser } from "@/hooks/queries/useQueryUser"
import { useUploadThing } from "@/lib/uploadthing"

type CoverPhotoProps = {
  userId?: string
  photoUrl?: string
}

const CoverPhoto: React.FC<CoverPhotoProps> = ({ userId, photoUrl }) => {
  const { updateCoverPhoto } = useUpdateDataMutation({
    userId,
  })

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
      <div className="h-full w-full">
        <div className="relative h-56 w-full">
          <Image
            src={photoUrl ?? "/cover.svg"}
            alt="profile"
            layout="fill"
            objectFit="cover"
            // containerclassnames="h-56 w-full relative"
          />
        </div>
        <div {...getRootProps()}>
          <div
            className={cn(
              "absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center gap-1 rounded-full bg-white px-1 text-foreground shadow-md md:w-32 md:rounded-md",
              "hover:bg-zinc-100 active:scale-110",
              "focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-zinc-200 active:text-secondary",
              "cursor-pointer"
            )}
          >
            <input {...getInputProps()} disabled={isUploading} />
            {isUploading ? (
              <ImSpinner3 size={20} className="animate-spin" />
            ) : (
              <AiFillCamera size={20} />
            )}
            <span className="hidden text-xs md:block">Edit cover photo</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoverPhoto
