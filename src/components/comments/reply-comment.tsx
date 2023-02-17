import { useForm, type SubmitHandler } from "react-hook-form";
import useCommentStore from "@/store/comment";
import ReplyItem from "./reply-item";
import Button from "@/components/shared/button";
import Loader from "@/components/shared/loader";
import type { ReplyComment as ReplyCommentType, User } from "@/types/types";
import React, { useEffect } from "react";
import CommentForm from "../shared/comment-form";
import { useInfiniteReplyQuery } from "@/lib/hooks/useQuery";
import {
  useMutateCreateReply,
  useMutateUpdateReply,
} from "@/lib/hooks/useCommentMutation";

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
  const [replyId, setReplyId] = useCommentStore((store) => [
    store.replyId,
    store.setReplyId,
  ]);
  const [replyComment, setReplyComment] = useCommentStore((store) => [
    store.replyComment,
    store.setReplyComment,
  ]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteReplyQuery(commentId);

  console.log(commentName);

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

  useEffect(() => {
    setFocus("comment");
  }, [setFocus]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const mutateAsyncCreate = useMutateCreateReply(commentId);
  const mutateAsyncUpdate = useMutateUpdateReply(commentId);

  const handleOnSubmit: SubmitHandler<ReplyValues> = async ({ comment }) => {
    if (replyId)
      await mutateAsyncUpdate({
        comment,
        commentId,
        id: replyId,
      });
    else
      await mutateAsyncCreate({
        comment,
        commentId,
      });
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
                  type="button"
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
        <CommentForm
          onSubmit={handleSubmit(handleOnSubmit)}
          register={register}
          reset={reset}
          commentId={replyId}
          commentText={watchReplyComment}
          handleCancel={cancelUpdate}
        />
      </div>
    </React.Fragment>
  );
};

export default ReplyComment;
