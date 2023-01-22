/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useRef, useState, useEffect, useMemo } from "react";
import Image from "../shared/image";
import TextareaAutoSize from "react-textarea-autosize";
import { trpc } from "@/utils/trpc";
import { useForm, type SubmitHandler } from "react-hook-form";
import usePostStore from "@/store/post";
import { IoMdSend } from "react-icons/io";

type CommentValues = {
  comment: string;
};

export type CommentProps = {
  postId: string;
};

const CreateComment: React.FC<CommentProps> = ({ postId }) => {
  const utils = trpc.useContext();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const commentId = usePostStore((store) => store.commentId);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    watch,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CommentValues>({
    defaultValues: {
      comment: "",
    },
  });

  const { data: currentComment } = trpc.comment.getCommentById.useQuery(
    {
      id: commentId,
    },
    {
      enabled: !!commentId,
    }
  );

  useEffect(() => {
    setFocus("comment");
  }, [setFocus]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const { mutateAsync: mutateAsyncCreate } =
    trpc.comment.createComment.useMutation({
      onError: (e) => setErrorMessage(e.message),
      onSuccess: async () => {
        await utils.comment.getComments.invalidate();
        await utils.post.getPosts.invalidate();
      },
    });

  const { mutateAsync: mutateAsyncUpdate } =
    trpc.comment.createComment.useMutation({
      onError: (e) => setErrorMessage(e.message),
      onSuccess: async () => {
        await utils.comment.getComments.invalidate();
        await utils.post.getPosts.invalidate();
      },
    });

  const handleOnSubmit: SubmitHandler<CommentValues> = async (data) => {
    setErrorMessage(undefined);

    if (!data.comment) return;

    if (currentComment && commentId) {
      await mutateAsyncUpdate({
        id: commentId,
        postId,
        comment: data.comment,
      });
    } else {
      await mutateAsyncCreate({
        comment: data.comment,
        postId,
      });
    }
  };

  const comment = watch("comment");

  useEffect(() => {
    if (currentComment && commentId) {
      setValue("comment", currentComment.comment);
    }
  }, [setValue, currentComment, commentId]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault();
      buttonRef?.current?.click();
      reset();
    }
  };

  return (
    <div className="pt-4 pl-5 pr-5">
      <div className="flex flex-row space-x-2">
        <div>
          <Image
            src="/default-image.png"
            alt="profile pic"
            objectFit="cover"
            layout="fill"
            className="rounded-full"
            containerclassnames="relative h-11 w-11"
          />
        </div>
        <div className="grow overflow-hidden">
          <div>
            <form
              onSubmit={handleSubmit(handleOnSubmit)}
              className="relative flex w-full flex-wrap justify-end"
            >
              <div className="relative w-full">
                <div className="flex flex-wrap justify-end">
                  <div className="shrink grow basis-[auto] overflow-hidden">
                    <div className="relative">
                      <TextareaAutoSize
                        placeholder="Write a comment..."
                        {...register("comment", { required: true })}
                        className="relative w-full rounded-2xl border-gray-500 bg-zinc-100 py-2 pl-3 pr-9 text-sm shadow transition focus:border"
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                  </div>
                </div>
                <button
                  disabled={comment?.trim().length === 0}
                  ref={buttonRef}
                  type="submit"
                  className="absolute bottom-4 right-2 text-xl text-primary"
                >
                  <IoMdSend />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
