"use client"

import React, { useState, useCallback, useMemo, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { AiFillCamera } from "react-icons/ai"
import { UploadButton, useUploadThing } from "@/lib/uploadthing"
import { useDropzone } from "@uploadthing/react"
import { generateClientDropzoneAccept } from "uploadthing/client"
import { ImSpinner3 } from "react-icons/im"
import { useUpdateDataMutation } from "@/hooks/useUpdateDataMutation"
import { useSession } from "next-auth/react"
import { buttonVariants } from "@/components/ui/button"

interface ProfileValues {
  image: File[]
}

type ProfilePhotoProps = {
  photoUrl?: string
  userId: string
}

const ProfilePhoto = (props: ProfilePhotoProps) => {
  const { photoUrl, userId } = props
  const { data: session } = useSession()
  const { updateProfilePhoto } = useUpdateDataMutation(userId)
  const { startUpload, permittedFileInfo, isUploading } = useUploadThing(
    "profilePicture",
    {
      onClientUploadComplete: (res) => {
        alert("uploaded successfully!")
        updateProfilePhoto.mutate({ url: res[0].url })
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
    <React.Fragment>
      <div className="relative -mt-20 flex-shrink-0">
        <div className="h-[114px] w-[114px] rounded-full">
          <Image
            className="relative rounded-full border-2 border-input"
            src={photoUrl ?? "/default-image.png"}
            alt=""
            style={{ objectFit: "cover" }}
            fill
          />
        </div>
        {userId === session?.user.id && (
          <div {...getRootProps()}>
            <div
              className={cn(
                "absolute bottom-3 right-0 flex h-8 w-8 items-center justify-center border border-input text-foreground",
                "cursor-pointer rounded-full",
                "bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                "items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                "active:scale-105"
              )}
            >
              <input
                {...getInputProps()}
                disabled={updateProfilePhoto.isPending}
              />
              {isUploading ? (
                <ImSpinner3 size={20} className="h-4 w-4 animate-spin" />
              ) : (
                <AiFillCamera size={20} className="h-4 w-4" />
              )}
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

export default ProfilePhoto

{
  /* <div className="">
          <form>
            <div className="flex flex-col items-center">
              <div className="overflow-hidden rounded-md border border-zinc-200 p-2">
                <Image
                  src={"/"}
                  alt=""
                  objectFit="cover"
                  layout="fill"
                  // containerclassnames="relative h-72 w-56"
                />
                <div className="mt-3 flex justify-end gap-2">
                  {isLoading ? (
                    <Loader
                      classNameContainer="text-zinc-900"
                      classNameIcon="h-8 w-8 animate-spin"
                    />
                  ) : (
                  <React.Fragment>
                    <Button
                      type="button"
                      className="flex h-8 w-20 items-center justify-center rounded-md font-semibold text-primary transition hover:bg-zinc-100"
                      aria-label="Close upload modal"
                      // onClick={() => reset()}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex h-8 w-20 items-center justify-center rounded-md bg-primary p-2 text-white transition duration-75 ease-in hover:bg-[#8371f8]"
                      aria-label="Save upload profile"
                      type="submit"
                    >
                      Save
                    </Button>
                  </React.Fragment>
                  )}
                </div>
              </div>

              <input />
              <input type="file" className="hidden" />
            </div>
          </form>
        </div> */
}
