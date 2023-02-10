import Image from "@/components/shared/image";
import TextareaAutoSize from "react-textarea-autosize";
import { trpc } from "@/utils/trpc";
import { useForm, type SubmitHandler } from "react-hook-form";
import useCommentStore from "@/store/comment";
import { IoMdSend } from "react-icons/io";
import ReplyItem from "./reply-item";
import Button from "@/components/shared/button";
import Loader from "@/components/shared/loader";
import type { ReplyComment as ReplyCommentType, User } from "@/types/types";
import React, { useState, useEffect, useRef } from "react";

type ReplyValues = {
  replyComment: string;
};

type ReplyCommentProps = {
  commentId: string;
  commentName?: string;
};

const ReplyComment: React.FC<ReplyCommentProps> = ({
  commentId,
  commentName,
}) => {
  const utils = trpc.useContext();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [replyId, setReplyId] = useCommentStore((store) => [
    store.replyId,
    store.setReplyId,
  ]);
  const [replyComment, setReplyComment] = useCommentStore((store) => [
    store.replyComment,
    store.setReplyComment,
  ]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = trpc.comment.getReplyComments.useInfiniteQuery(
    {
      limit: 3,
      commentId: commentId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextSkip,
      refetchOnWindowFocus: false,
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    watch,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ReplyValues>({
    defaultValues: {
      replyComment: "",
    },
  });

  const onSuccess = async () => {
    await utils.comment.getReplyComments.invalidate({
      limit: 3,
      commentId,
    });
  };

  useEffect(() => {
    setFocus("replyComment");
  }, [setFocus]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const { mutateAsync: mutateAsyncCreate } =
    trpc.comment.replyComment.useMutation({
      onError: (e) => setErrorMessage(e.message),
      onSuccess: async () => {
        await onSuccess();
      },
    });

  const { mutateAsync: mutateAsyncUpdate } =
    trpc.comment.updateReplyComment.useMutation({
      onError: (e) => setErrorMessage(e.message),
      onSuccess: async () => {
        await onSuccess();
      },
    });

  const handleOnSubmit: SubmitHandler<ReplyValues> = async (data) => {
    setErrorMessage(undefined);

    if (replyId) {
      await mutateAsyncUpdate({
        comment: data.replyComment,
        commentId,
        id: replyId,
      });
    } else {
      await mutateAsyncCreate({
        comment: data.replyComment,
        commentId,
      });
    }
  };

  const watchReplyComment = watch("replyComment");

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault();
      buttonRef?.current?.click();
      reset();
    }
  };

  useEffect(() => {
    if (replyId) {
      setValue("replyComment", replyComment);
    }
  }, [replyId, setValue, replyComment]);

  const cancelUpdate = () => {
    reset();
    setReplyId("");
    setReplyComment("");
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Loader
          classNameContainer="text-gray-800"
          classNameIcon="h-4 w-4 animate-spin"
        />
      ) : (
        <ul>
          {hasNextPage && (
            <li>
              {isFetchingNextPage ? (
                <Loader
                  classNameContainer="ml-8 mt-2 text-gray-800"
                  classNameIcon="h-4 w-4 animate-spin"
                />
              ) : (
                <Button
                  onClick={() => fetchNextPage()}
                  className="ml-2 text-sm font-semibold text-gray-800 hover:text-gray-900"
                >
                  View more replies
                </Button>
              )}
            </li>
          )}

          {data?.pages
            .map((page) =>
              page.replyComments
                .map((comment) => (
                  <ReplyItem
                    setFocus={setFocus}
                    comment={comment as ReplyCommentType<User>}
                    commentId={commentId}
                    key={comment.id}
                  />
                ))
                .reverse()
            )
            .reverse()}
        </ul>
      )}
      <div className="pt-2 pl-5">
        <div className="absolute left-[42px] h-[20px] w-[45px] border-l-2 border-b-2 border-gray-300 border-t-white"></div>
        <div className="flex flex-row space-x-2">
          <div>
            <Image
              src="/default-image.png"
              alt="profile pic"
              objectFit="cover"
              layout="fill"
              className="rounded-full"
              containerclassnames="relative h-9 w-9"
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
                          placeholder={`Reply to ${commentName || ""}`}
                          {...register("replyComment", { required: true })}
                          className="relative w-full rounded-full border-gray-500 bg-zinc-100 py-2 pl-3 pr-9 text-sm shadow transition focus:border"
                          onKeyDown={handleKeyPress}
                        />
                        {replyId && (
                          <div className="flex gap-1 text-xs text-primary">
                            <Button onClick={cancelUpdate}>Cancel</Button>
                            <span>Esc</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    disabled={watchReplyComment?.trim().length === 0}
                    ref={buttonRef}
                    type="submit"
                    className="absolute bottom-7 right-2 text-xl text-primary"
                  >
                    <IoMdSend />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ReplyComment;
