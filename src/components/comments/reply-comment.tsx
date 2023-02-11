import Image from "@/components/shared/image";
import { trpc } from "@/utils/trpc";
import { useForm, type SubmitHandler } from "react-hook-form";
import useCommentStore from "@/store/comment";
import ReplyItem from "./reply-item";
import Button from "@/components/shared/button";
import Loader from "@/components/shared/loader";
import type { ReplyComment as ReplyCommentType, User } from "@/types/types";
import React, { useState, useEffect } from "react";
import classNames from "classnames";
import CommentForm from "../shared/comment-form";
import { useAuthQuery } from "hooks/useQuery";

type ReplyValues = {
  comment: string;
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

  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [replyId, setReplyId] = useCommentStore((store) => [
    store.replyId,
    store.setReplyId,
  ]);
  const [replyComment, setReplyComment] = useCommentStore((store) => [
    store.replyComment,
    store.setReplyComment,
  ]);

  const { data: authUser } = useAuthQuery();

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    trpc.comment.getReplyComments.useInfiniteQuery(
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
    formState: { isSubmitSuccessful },
  } = useForm<ReplyValues>({
    defaultValues: {
      comment: "",
    },
  });

  const onSuccess = async () => {
    await utils.comment.getReplyComments.invalidate({
      limit: 3,
      commentId,
    });
  };

  useEffect(() => {
    setFocus("comment");
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
        comment: data.comment,
        commentId,
        id: replyId,
      });
    } else {
      await mutateAsyncCreate({
        comment: data.comment,
        commentId,
      });
    }
  };

  const watchReplyComment = watch("comment");

  useEffect(() => {
    if (replyId) {
      setValue("comment", replyComment);
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
          classNameContainer="text-zinc-800"
          classNameIcon="h-4 w-4 animate-spin"
        />
      ) : (
        <ul>
          {hasNextPage && (
            <li>
              {isFetchingNextPage ? (
                <Loader
                  classNameContainer="ml-8 mt-2 text-zinc-800"
                  classNameIcon="h-4 w-4 animate-spin"
                />
              ) : (
                <Button
                  onClick={() => fetchNextPage()}
                  className="ml-2 text-sm font-semibold text-zinc-800 hover:text-zinc-900"
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
      <div className="pt-1 pl-5">
        <div className="absolute left-[42px] h-[27px] w-[45px] border-l-2 border-b-2 border-zinc-300 border-t-white"></div>
        <div className="flex flex-row items-center space-x-2">
          <div>
            <Image
              src={authUser?.image || "/default-image.png"}
              alt={authUser?.name || ""}
              objectFit="cover"
              layout="fill"
              className="rounded-full"
              containerclassnames="relative h-9 w-9"
            />
          </div>
          <CommentForm
            onSubmit={handleSubmit(handleOnSubmit)}
            register={register}
            reset={reset}
            commentId={commentId}
            commentText={watchReplyComment}
            handleCancel={cancelUpdate}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ReplyComment;
