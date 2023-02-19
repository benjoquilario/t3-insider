import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import useCommentStore from "@/store/comment";
import type { Comment as CommentType, User } from "@/types/types";
import Comment from "./comment";
import { ImSpinner8 } from "react-icons/im";
import CommentForm from "../shared/comment-form";
import { useInfiniteCommentsQuery } from "@/lib/hooks/useQuery";
import {
  useMutateCreateComment,
  useMutateUpdateComment,
} from "@/lib/hooks/useCommentMutation";
import Button from "../shared/button";

type CommentValues = {
  comment: string;
};

export type CommentProps = {
  postId: string;
};

const CreateComment: React.FC<CommentProps> = ({ postId }) => {
  const [commentId, setCommentId] = useCommentStore((store) => [
    store.commentId,
    store.setCommentId,
  ]);
  const [commentMessage, setCommentMessage] = useCommentStore((store) => [
    store.commentMessage,
    store.setCommentMessage,
  ]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteCommentsQuery(postId);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    watch,
    formState: { isSubmitSuccessful },
  } = useForm<CommentValues>({
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

  // mutation
  const mutateAsyncCreate = useMutateCreateComment();
  const mutateAsyncUpdate = useMutateUpdateComment();

  const handleOnSubmit: SubmitHandler<CommentValues> = async (data) => {
    if (!data.comment) return;

    if (commentId && commentMessage) {
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
    if (commentId) {
      setValue("comment", commentMessage);
    }
  }, [setValue, commentMessage, commentId]);

  const cancelUpdate = () => {
    reset();
    setCommentId("");
    setCommentMessage("");
  };

  return (
    <React.Fragment>
      {!isLoading ? (
        <div className="pb-4" id="comment">
          <div className="pt-4 pl-5 pr-5">
            <CommentForm
              commentId={commentId}
              commentText={comment}
              reset={reset}
              register={register}
              handleCancel={cancelUpdate}
              onSubmit={handleSubmit(handleOnSubmit)}
            />
          </div>
          <ul>
            {data?.pages.map((page) =>
              page.comments.map((comment) => (
                <Comment
                  key={comment.id}
                  setFocus={setFocus}
                  comment={comment as CommentType<User>}
                />
              ))
            )}
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-4">
                <ImSpinner8 className="animate-spin text-2xl text-black" />
              </div>
            )}
            {!isFetchingNextPage && hasNextPage && (
              <li className="ml-4">
                <Button
                  type="button"
                  onClick={() => fetchNextPage()}
                  className="underline-offset-1 hover:underline"
                >
                  View more comments
                </Button>
              </li>
            )}
          </ul>
        </div>
      ) : (
        <div className="flex items-center justify-center py-4">
          <ImSpinner8 className="animate-spin text-2xl text-black" />
        </div>
      )}
    </React.Fragment>
  );
};

export default CreateComment;
