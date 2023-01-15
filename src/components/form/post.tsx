/* eslint-disable @typescript-eslint/no-misused-promises */
import { motion } from "framer-motion";
import { formVariant, uploadPicture } from "@/utils/index";
import { RiCloseFill } from "react-icons/ri";
import type { PostSchema as PostValues } from "@/server/schema/post";
import Image from "next/legacy/image";
import Backdrop from "@/components/shared/backdrop";
import useClickOutside from "hooks/useClickOutside";
import usePostStore from "@/store/post";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import Button from "@/components/shared/button";
import Input from "../shared/input";
import React, { useState, useRef } from "react";
import { useRouter } from "next/router";

const PostForm = ({ refetch }) => {
  const ref = useRef(null);
  const { data: session } = useSession();
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const postOpen = usePostStore((store) => store.postOpen);
  const setPostOpen = usePostStore((store) => store.setPostOpen);
  const [currentFile, setCurrentFile] = useState<File | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState("");

  const mutation = trpc.post.createPost.useMutation({
    onError: (e) => setErrorMessage(e.message),
    onSuccess: () => {
      refetch();
      setPostOpen(false);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostValues>();

  const handleOnSubmit: SubmitHandler<PostValues> = async (data) => {
    setErrorMessage(undefined);
    let uploadPhoto;

    if (currentFile) {
      uploadPhoto = await uploadPicture(currentFile);
    }

    await mutation.mutateAsync({
      ...data,
      name: session?.user?.name,
      selectedFile: (uploadPhoto as string) || "",
    });
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    setCurrentFile(selectedFiles?.[0]);
    setPreviewImage(URL.createObjectURL(selectedFiles?.[0] as never));
  };

  useClickOutside(ref, () => setPostOpen(false));

  return (
    <React.Fragment>
      {postOpen && (
        <Backdrop>
          <div
            ref={ref}
            className="z-20 m-4 h-auto w-full max-w-screen-md rounded-md border border-gray-600 bg-gray-900 shadow-md md:w-2/4"
          >
            <div className="flex items-center justify-between p-2">
              <h3 className="p-2 text-base text-white md:text-lg">
                Creating Post
              </h3>

              <button
                className="rounded-full p-2 text-white transition duration-75 ease-in hover:bg-gray-700"
                aria-label="close modal"
                onClick={() => setPostOpen(false)}
              >
                <RiCloseFill aria-hidden="true" size={25} />
              </button>
            </div>
            <motion.div
              variants={formVariant}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative"
            >
              <form
                autoComplete="off"
                className=""
                onSubmit={handleSubmit(handleOnSubmit)}
              >
                <textarea
                  aria-label={`What's on your mind, Benjo?`}
                  className="h-32 w-full resize-none overflow-auto rounded-t-md bg-gray-900 p-3 text-sm text-white focus:outline-none md:text-base"
                  placeholder={`What's on your mind, Benjo?`}
                  // value={postData?.message}
                  cols={30}
                  rows={30}
                  {...register("message", { required: true })}
                ></textarea>
                <div className="rounded-b-md bg-gray-900 p-3">
                  {previewImage && (
                    <div className="relative h-56 w-full overflow-auto">
                      <Image
                        src={previewImage}
                        alt="post"
                        layout="fill"
                        objectFit="cover"
                      />
                      <Button
                        onClick={() => setPreviewImage("")}
                        className="absolute top-2 right-0 rounded-full bg-gray-600 p-1 text-white transition duration-75 ease-in hover:bg-gray-700"
                      >
                        <RiCloseFill aria-hidden="true" size={22} />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-white md:text-sm">
                      Upload Photo :
                    </p>
                    <div className="relative overflow-hidden text-xs text-white md:text-sm">
                      <Input
                        {...register("selectedFile", { required: false })}
                        type="file"
                        name="selectedFile"
                        onChange={handleOnChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    type="submit"
                    className="m-3 flex w-full items-center justify-center rounded-md bg-[#6a55fa] px-3 py-2 text-sm text-white disabled:bg-[#6a55fa1a] md:text-base"
                  >
                    Create Post
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </Backdrop>
      )}
    </React.Fragment>
  );
};

export default PostForm;
