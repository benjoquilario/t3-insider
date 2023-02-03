import { motion } from "framer-motion";
import { uploadPicture } from "@/utils/cloudinary";
import { variants } from "@/utils/index";
import { RiCloseFill } from "react-icons/ri";
import Backdrop from "@/components/shared/backdrop";
import useClickOutside from "hooks/useClickOutside";
import usePostStore from "@/store/post";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import Button from "@/components/shared/button";
import { ImSpinner8 } from "react-icons/im";
import TextareaAutoSize from "react-textarea-autosize";
import classNames from "classnames";
import type { SelectedFileType } from "@/types/types";
import type { SubmitHandler } from "react-hook-form";
import usePost from "hooks/usePost";
import PostInput from "../posts/post-input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useRef, useEffect } from "react";

export interface PostValues {
  message: string;
  selectedFile: File[];
  imageUploadProgress: number[];
}

const CreateForm = () => {
  const utils = trpc.useContext();
  const ref = useRef(null);
  const { data: session } = useSession();
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const postOpen = usePostStore((store) => store.postOpen);
  const setPostOpen = usePostStore((store) => store.setPostOpen);
  const currentPostId = usePostStore((store) => store.currentPostId);

  const [isEditing, setIsEditing] = usePostStore((store) => [
    store.isEditing,
    store.setIsEditing,
  ]);

  const {
    getRootProps,
    getInputProps,
    finalUploadProgress,
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
  } = usePost();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const { mutateAsync: mutateCreatePost, isLoading: isCreatePostLoading } =
    trpc.post.createPost.useMutation({
      onError: (e) => {
        setErrorMessage(e.message);
      },
      onSuccess: async () => {
        toast("Your post was added successfully", {
          type: "success",
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        await utils.post.getPosts.invalidate();
        await utils.post.getPostsById.invalidate({
          id: session?.user?.id,
          limit: 3,
        });
      },
    });

  const { mutateAsync: mutateUpdatePost, isLoading: isUpdateLoading } =
    trpc.post.updatePost.useMutation({
      onError: (e) => {
        setErrorMessage(e.message);
      },
      onSuccess: async () => {
        toast("Your post was updated successfully", {
          type: "success",
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        await utils.post.getPosts.invalidate();
      },
    });

  const { data: currentPost, isLoading: isPostLoading } =
    trpc.post.getPostById.useQuery(
      {
        id: currentPostId,
      },
      {
        enabled: !!currentPostId,
      }
    );

  useEffect(() => {
    setFocus("message");
  }, [setFocus]);

  const handleOnReset = () => {
    reset();
    setPostOpen(false);
    setIsEditing(false);
    setIsUploading(false);
  };

  const handleOnSubmit: SubmitHandler<PostValues> = async (data) => {
    setErrorMessage(undefined);

    const imageUrls = await Promise.all(
      data.selectedFile.map((file: File, index) =>
        uploadPicture(file, (progress) => {
          const imageUploadProgress = getValues("imageUploadProgress");
          setValue(
            "imageUploadProgress",
            imageUploadProgress.map((val, i) => (i === index ? progress : val))
          );
        })
      )
    );

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
      });
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
      });

    return handleOnReset();
  };

  const message = watch("message");

  useClickOutside(ref, () => setPostOpen(false));

  useEffect(() => {
    postOpen && (document.body.style.overflow = "hidden");

    const focusTrap = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPostOpen(false);
      }

      if (event.key !== "Tab") return;
    };

    document.addEventListener("keydown", focusTrap);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", focusTrap);
    };
  }, [postOpen, setPostOpen]);

  const enabledButton = !isUploading && message?.trim().length > 0;

  useEffect(() => {
    if (currentPostId && currentPost && !isPostLoading) {
      setValue("message", currentPost.message);
    }
  }, [currentPostId, currentPost, setValue, isPostLoading]);

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
          <div className="flex items-center justify-between border-b border-gray-200 p-2">
            <h3 className="p-2 text-base text-black md:text-lg">
              {isEditing ? "Updating Post" : "Creating Post"}
            </h3>

            <Button
              className="rounded-full bg-[#edf1f5] p-2 text-gray-700 transition duration-75 ease-in hover:bg-[#e5e8eb]"
              aria-label="close modal"
              onClick={() => handleOnReset()}
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
                selectedFile={currentPost?.selectedFile as SelectedFileType[]}
              >
                <input {...getInputProps()} />
              </PostInput>

              <div className="flex items-center justify-center">
                {isCreatePostLoading || isUpdateLoading ? (
                  <div className="m-3 flex w-full items-center justify-center rounded-md bg-[#6a55fa] px-3 py-2 text-lg">
                    <ImSpinner8 className="animate-spin text-2xl text-white" />
                  </div>
                ) : (
                  <Button
                    disabled={!enabledButton}
                    type="submit"
                    className="my-2 mx-3 flex w-full items-center justify-center rounded-md bg-[#6a55fa] px-3 py-2 text-sm text-white disabled:bg-[#6a55fa1a] hover:bg-[#8371f8] md:text-base"
                  >
                    {isEditing ? "Update Post" : "Create Post"}
                  </Button>
                )}
              </div>
              {finalUploadProgress !== 0 && (
                <div className="h-1 w-full overflow-hidden rounded-sm">
                  <div
                    className="h-full w-full bg-blue-500"
                    style={{
                      transform: `translateX(-${100 - finalUploadProgress}%)`,
                    }}
                  />
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </Backdrop>
    </React.Fragment>
  );
};

export default CreateForm;
