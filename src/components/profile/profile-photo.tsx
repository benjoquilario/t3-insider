"use client"

import React, { useState, useCallback, useMemo, useRef } from "react"
import Image from "next/image"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { AiFillCamera } from "react-icons/ai"
import { RiCloseFill } from "react-icons/ri"
import { UploadButton, useUploadThing } from "@/lib/uploadthing"
import { useWatch } from "react-hook-form"
import { useUploadProfile } from "@/hooks/useUploadProfile"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useDropzone } from "@uploadthing/react"
import { generateClientDropzoneAccept } from "uploadthing/client"
import { updateProfilePicture } from "@/server/user"
import { ImSpinner3 } from "react-icons/im"
import { useUpdateDataMutation } from "@/hooks/useUpdateDataMutation"
import { useSession } from "next-auth/react"
import { useQueryUser } from "@/hooks/queries/useQueryUser"

interface ProfileValues {
  image: File[]
}

type ProfilePhotoProps = {
  photoUrl?: string
  userId?: string
}

const ProfilePhoto = (props: ProfilePhotoProps) => {
  const { photoUrl, userId } = props
  const { updateProfilePhoto } = useUpdateDataMutation({
    userId,
  })
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
            className="relative rounded-full border-4"
            src={photoUrl ?? "/default-image.png"}
            alt=""
            style={{ objectFit: "cover" }}
            fill
          />
        </div>
        <div {...getRootProps()}>
          <div
            className={cn(
              "absolute bottom-3 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-md",
              "hover:text-primary/90 active:scale-110",
              "focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-secondary active:text-secondary",
              "cursor-pointer"
            )}
          >
            <input
              {...getInputProps()}
              disabled={updateProfilePhoto.isPending}
            />
            {isUploading ? (
              <ImSpinner3 size={20} className="animate-spin" />
            ) : (
              <AiFillCamera size={20} />
            )}
          </div>
        </div>
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
