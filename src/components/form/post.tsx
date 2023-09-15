import { motion } from "framer-motion"
import { uploadPicture } from "@/lib/utils/cloudinary"
import { variants } from "@/lib/utils/index"
import { RiCloseFill } from "react-icons/ri"
import Backdrop from "@/components/shared/backdrop"
import useClickOutside from "@/lib/hooks/useClickOutside"
import usePostStore from "@/store/post"
import { useSession } from "next-auth/react"
import Button from "@/components/shared/button"
import { ImSpinner8 } from "react-icons/im"
import TextareaAutoSize from "react-textarea-autosize"
import classNames from "classnames"
import type { SubmitHandler } from "react-hook-form"
import usePost from "@/lib/hooks/usePost"
import PostInput from "../posts/post-input"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import React, { useState, useRef, useEffect, useCallback } from "react"
import {
  useMutateCreatePost,
  useMutateDeleteImages,
  useMutateUpdatePost,
} from "@/lib/hooks/usePostMutation"

export interface PostValues {
  message: string
  selectedFile: File[]
  imageUploadProgress: number[]
}

const CreateForm = () => {
  const ref = useRef(null)
  const { data: session } = useSession()
  const [errorMessage, setErrorMessage] = useState<string | undefined>("")
  const postOpen = usePostStore((store) => store.postOpen)
  const [isRemove, setIsRemove] = usePostStore((store) => [
    store.isRemove,
    store.setIsRemove,
  ])
  const setPostOpen = usePostStore((store) => store.setPostOpen)
  const currentPostId = usePostStore((store) => store.currentPostId)
  const [selectedPost, clearSelectedPost] = usePostStore((store) => [
    store.selectedPost,
    store.clearSelectedPost,
  ])
  const [deleteImages, clearDeletedImages] = usePostStore((store) => [
    store.deleteImages,
    store.clearDeletedImages,
  ])

  const [isEditing, setIsEditing] = usePostStore((store) => [
    store.isEditing,
    store.setIsEditing,
  ])

  const {
    getRootProps,
    getInputProps,
    isImageDragged,
    openFilePicker,
    handleSubmit,
    isSubmitSuccessful,
    register,
    watch,
    reset,
    control,
    setValue,
    getValues,
    setFocus,
    isUploading,
    setIsUploading,
  } = usePost()

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful, reset])

  const onSuccessCreate = () => {
    toast("Your post was added successfully", {
      type: "success",
      position: toast.POSITION.BOTTOM_LEFT,
    })
  }

  const onSuccessUpdate = () => {
    toast("Your post was updated successfully", {
      type: "success",
      position: toast.POSITION.BOTTOM_LEFT,
    })
  }

  const { mutateCreatePost, isCreatePostLoading } = useMutateCreatePost(
    onSuccessCreate,
    session?.user?.id
  )
  const { mutateUpdatePost, isUpdateLoading } =
    useMutateUpdatePost(onSuccessUpdate)

  const mutateDeleteImage = useMutateDeleteImages(session?.user?.id)

  useEffect(() => {
    setFocus("message")
  }, [setFocus])

  const handleOnReset = () => {
    reset()
    setPostOpen(false)
    setIsEditing(false)
    setIsUploading(false)
    setIsRemove(false)
    clearDeletedImages()
    clearSelectedPost()
  }

  const handleOnSubmit: SubmitHandler<PostValues> = async (data) => {
    setErrorMessage(undefined)
    setIsUploading(true)

    const imageUrls = await Promise.all(
      data.selectedFile.map((file: File, index) =>
        uploadPicture(file, (progress) => {
          const imageUploadProgress = getValues("imageUploadProgress")
          setValue(
            "imageUploadProgress",
            imageUploadProgress.map((val, i) => (i === index ? progress : val))
          )
        })
      )
    )

    if (isEditing && currentPostId)
      await mutateUpdatePost({
        ...data,
        name: session?.user?.name,
        selectedFile: imageUrls.length
          ? imageUrls.map((image) => ({
              url: image.url,
              fallbackUrl: image.fallbackUrl,
              width: image.width,
              height: image.height,
              postId: currentPostId,
            }))
          : null,
        id: currentPostId,
      })
    else
      await mutateCreatePost({
        ...data,
        name: session?.user?.name,
        selectedFile: imageUrls.length
          ? imageUrls.map((image) => ({
              url: image.url,
              fallbackUrl: image.fallbackUrl,
              width: image.width,
              height: image.height,
            }))
          : null,
      })

    if (isRemove) {
      deleteImages.map((id) => mutateDeleteImage({ id }))
    }

    return handleOnReset()
  }

  const message = watch("message")

  useEffect(() => {
    postOpen && (document.body.style.overflow = "hidden")

    const focusTrap = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPostOpen(false)
      }

      if (event.key !== "Tab") return
    }

    document.addEventListener("keydown", focusTrap)

    return () => {
      document.body.style.overflow = "unset"
      document.removeEventListener("keydown", focusTrap)
    }
  }, [postOpen, setPostOpen])

  const enabledButton = !isUploading && message?.trim().length > 0

  useEffect(() => {
    if (currentPostId && selectedPost) {
      setValue("message", selectedPost.message)
    }
  }, [currentPostId, setValue, selectedPost])

  const hidePostOpen = useCallback(() => setPostOpen(false), [setPostOpen])

  useClickOutside(ref, () => hidePostOpen())

  return (
    <React.Fragment>
      <Backdrop>
        <motion.div
          variants={variants}
          initial="hidden"
          animate={postOpen ? "visible" : "hidden"}
          ref={ref}
          className="z-20 m-4 h-auto w-full max-w-screen-md rounded-md bg-white shadow-md md:w-2/4"
        >
          {errorMessage && <div>{errorMessage}</div>}
          <div className="flex items-center justify-between border-b border-zinc-200 p-2">
            <h3 className="p-2 text-base text-zinc-900 md:text-lg">
              {isEditing ? "Updating Post" : "Creating Post"}
            </h3>

            <Button
              className="rounded-full bg-[#edf1f5] p-2 text-zinc-700 transition duration-75 ease-in hover:bg-[#e5e8eb]"
              aria-label="close modal"
              onClick={handleOnReset}
            >
              <RiCloseFill aria-hidden="true" size={25} />
            </Button>
          </div>
          <div
            className={classNames(
              "relative",
              isImageDragged && "outline-dashed outline-blue-500"
            )}
            {...getRootProps()}
          >
            <form
              autoComplete="off"
              className=""
              onSubmit={handleSubmit(handleOnSubmit)}
            >
              <TextareaAutoSize
                aria-label={`What's on your mind, Benjo?`}
                className="w-full rounded-t-md  bg-white p-3 text-sm text-black focus:outline-none md:text-base"
                placeholder={`What's on your mind, Benjo?`}
                {...register("message", { required: false })}
              />
              <PostInput
                openFilePicker={openFilePicker}
                control={control}
                setValue={setValue}
                selectedFile={selectedPost.selectedFile}
              >
                <input {...getInputProps()} />
              </PostInput>
              <div className="flex items-center justify-center">
                {isCreatePostLoading || isUpdateLoading || isUploading ? (
                  <div className="m-3 flex w-full items-center justify-center rounded-md bg-[#6a55fa] px-3 py-2 text-lg">
                    <ImSpinner8 className="animate-spin text-2xl text-white" />
                  </div>
                ) : (
                  <Button
                    disabled={!enabledButton}
                    type="submit"
                    className="mx-3 my-2 flex w-full items-center justify-center rounded-md bg-[#6a55fa] px-3 py-2 text-sm text-white disabled:bg-[#6a55fa1a] hover:bg-[#8371f8] md:text-base"
                  >
                    {isEditing ? "Update Post" : "Create Post"}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </Backdrop>
    </React.Fragment>
  )
}

export default CreateForm
