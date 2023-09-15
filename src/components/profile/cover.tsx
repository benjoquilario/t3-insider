import React, { useMemo, useEffect } from "react"
import Image from "@/components/shared/image"
import { AiFillCamera } from "react-icons/ai"
import Button from "@/components/shared/button"
import useProfileDropZone from "@/lib/hooks/useProfileZone"
import { trpc } from "@/lib/utils/trpc"
import { useForm, type SubmitHandler } from "react-hook-form"
import { uploadPicture } from "@/lib/utils/cloudinary"
import { toast } from "react-toastify"
import classNames from "classnames"
import { useSession } from "next-auth/react"

type CoverPhotoProps = {
  coverPhoto?: string | null
  userId: string
}

interface CoverValues {
  coverPhoto: File[]
}

const CoverPhoto: React.FC<CoverPhotoProps> = ({ coverPhoto, userId }) => {
  const utils = trpc.useContext()
  const { data: session } = useSession()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<CoverValues>({
    defaultValues: {
      coverPhoto: [],
    },
  })

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
  }, [reset, isSubmitSuccessful])

  const draftCoverFile = watch("coverPhoto")[0]

  const draftCover = useMemo(
    () => (draftCoverFile ? URL.createObjectURL(draftCoverFile) : null),
    [draftCoverFile]
  )

  const { mutateAsync } = trpc.user.uploadPhoto.useMutation({
    onError: (e) => console.log(e.message),
    onSuccess: async () => {
      toast("Your cover photo was updated successfully", {
        type: "success",
        position: toast.POSITION.BOTTOM_RIGHT,
      })

      await utils.user.getUserById.invalidate({ id: userId })
      await utils.user.getUsers.invalidate()
    },
  })

  const handleOnSubmit: SubmitHandler<CoverValues> = async (data) => {
    const coverUrl = await uploadPicture(data.coverPhoto[0] as File)

    await mutateAsync({
      coverPhoto: coverUrl?.url,
    })
  }

  const setCover = (file: File[]) => {
    setValue("coverPhoto", file)
  }

  const {
    isDragActive: isCoverDragged,
    getInputProps: getInputProps,
    getRootProps: getRootCoverProps,
    open: openCover,
  } = useProfileDropZone(setCover)

  console.log(isCoverDragged && "Dragged")

  return (
    <div
      className="relative h-56 w-full overflow-hidden bg-white shadow"
      {...getRootCoverProps}
    >
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <div className="h-full w-full">
          <Image
            src={draftCover || coverPhoto || "/cover.svg"}
            alt="profile"
            layout="fill"
            objectFit="cover"
            containerclassnames="h-56 w-full relative"
          />
          {draftCoverFile ? (
            <div className="absolute bottom-3 right-3 flex items-center gap-1">
              <Button
                onClick={() => reset()}
                type="button"
                className="flex h-8 w-20 items-center justify-center rounded-md bg-white text-primary transition hover:bg-zinc-100"
                aria-label="Close upload modal"
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
            </div>
          ) : (
            session?.user?.id === userId && (
              <Button
                onClick={openCover}
                type="button"
                className={classNames(
                  "absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center gap-1 rounded-full bg-white px-1 shadow-md md:w-32 md:rounded-md",
                  " hover:bg-zinc-100 active:scale-110",
                  "focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-zinc-200 active:text-secondary"
                )}
              >
                <AiFillCamera size={20} />
                <span className="hidden text-xs md:block">
                  Edit cover photo
                </span>
              </Button>
            )
          )}
          <input {...getInputProps()} />
          <input {...register("coverPhoto")} type="file" className="hidden" />
        </div>
      </form>
    </div>
  )
}

export default CoverPhoto
