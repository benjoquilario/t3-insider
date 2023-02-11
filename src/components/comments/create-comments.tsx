import React, { useRef, useState, useEffect } from "react";
import Image from "../shared/image";
import { trpc } from "@/utils/trpc";
import { useForm, type SubmitHandler } from "react-hook-form";
import useCommentStore from "@/store/comment";
import type { Comment as CommentType, User } from "@/types/types";
import Comment from "./comment";
import { ImSpinner8 } from "react-icons/im";
import classNames from "classnames";
import CommentForm from "../shared/comment-form";
import { useAuthQuery, useInfiniteCommentsQuery } from "hooks/useQuery";

type CommentValues = {
  comment: string;
};

export type CommentProps = {
  postId: string;
};

const CreateComment: React.FC<CommentProps> = ({ postId }) => {
  const utils = trpc.useContext();

  const { data: authUser } = useAuthQuery();
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [commentId, setCommentId] = useCommentStore((store) => [
    store.commentId,
    store.setCommentId,
  ]);
  const [commentMessage, setCommentMessage] = useCommentStore((store) => [
    store.commentMessage,
    store.setCommentMessage,
  ]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  } = useInfiniteCommentsQuery(postId);

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

  const onSuccess = async () => {
    await utils.comment.getComments.invalidate();
    await utils.post.getPosts.invalidate();
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
    trpc.comment.createComment.useMutation({
      onError: (e) => setErrorMessage(e.message),
      onSuccess: async () => {
        await onSuccess();
      },
    });

  const { mutateAsync: mutateAsyncUpdate } =
    trpc.comment.updateComment.useMutation({
      onError: (e) => setErrorMessage(e.message),
      onSuccess: async () => {
        await onSuccess();
      },
    });

  const handleOnSubmit: SubmitHandler<CommentValues> = async (data) => {
    setErrorMessage(undefined);

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
            <div className="flex flex-row items-center space-x-2">
              <div>
                <Image
                  src={authUser?.image || "/default-image.png"}
                  alt="profile pic"
                  objectFit="cover"
                  layout="fill"
                  className="rounded-full"
                  containerclassnames="relative h-11 w-11"
                />
              </div>
              <CommentForm
                commentId={commentId}
                commentText={comment}
                reset={reset}
                register={register}
                handleCancel={cancelUpdate}
                onSubmit={handleSubmit(handleOnSubmit)}
              />
            </div>
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
                <button
                  onClick={() => fetchNextPage()}
                  className="underline-offset-1 hover:underline"
                >
                  View more comments
                </button>
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
