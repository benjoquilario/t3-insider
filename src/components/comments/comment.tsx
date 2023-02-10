import React, { useState, useRef, useMemo } from "react";
import Button from "../shared/button";
import Link from "next/link";
import Image from "../shared/image";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsArrow90DegDown } from "react-icons/bs";
import { AiFillLike } from "react-icons/ai";
import ModalComment from "../modal/modal-comment";
import useClickOutside from "hooks/useClickOutside";
import { trpc } from "@/utils/trpc";
import useCommentStore from "@/store/comment";
import type { Comment as CommentType, User } from "@/types/types";
import classNames from "classnames";
import ReplyComment from "./reply-comment";
import type { UseFormSetFocus } from "react-hook-form";
import ReactTimeAgo from "react-time-ago";
import Loader from "../shared/loader";
import { useSession } from "next-auth/react";

type CommentProps = {
  comment: CommentType<User>;
  setFocus: UseFormSetFocus<{ comment: string }>;
};

const Comment: React.FC<CommentProps> = ({ comment, setFocus }) => {
  const utils = trpc.useContext();
  const { data: session } = useSession();
  const ref = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [setCommentId, setCommentMessage] = useCommentStore((store) => [
    store.setCommentId,
    store.setCommentMessage,
  ]);
  const [isLiked, setIsLiked] = useState(comment.isLike);
  const setIsCommentModalOpen = useCommentStore(
    (store) => store.setIsCommentModalOpen
  );

  const likes = useMemo(
    () => comment.likeComment.find((like) => like.commentId === comment.id),
    [comment]
  );

  useClickOutside(ref, () => setIsModalOpen(false));

  const { mutate: mutateDeleteComment, isLoading } =
    trpc.comment.deleteComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await utils.comment.getComments.invalidate();
      },
    });

  const { mutate: mutateLikeComent, isLoading: isLikeLoading } =
    trpc.like.likeComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await utils.comment.getComments.invalidate();
      },
    });

  const handleLikeComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutateLikeComent({
      commentId: comment.id,
      id: likes?.id,
      isLiked: !isLiked,
    });
    setIsLiked(!isLiked);
  };

  const handleDeleteComment = () => {
    setIsCommentModalOpen(true);
    setCommentId(comment.id);
    setIsModalOpen(false);
  };

  const handleUpdateComment = () => {
    setCommentId(comment.id);
    setCommentMessage(comment.comment);
    setFocus("comment");
  };

  return (
    <div>
      <div className="relative flex pt-2 pl-6">
        <div className="relative mt-1 mr-2 block rounded-full">
          {isReplyOpen || comment._count.reply > 0 ? (
            <div className="absolute left-[18px] top-[30px] h-[calc(100%_-_53px)] w-[2px] bg-gray-300"></div>
          ) : null}
          <span className="inline">
            <Link
              href="/"
              className="relative inline-block w-full shrink basis-[auto] items-stretch"
            >
              <div className="relative inline-block">
                <Image
                  className="h-9 w-9 rounded-full object-cover"
                  src="/default-image.png"
                  alt="prof"
                  objectFit="cover"
                  layout="fill"
                  containerclassnames="h-9 w-9"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-full"></div>
            </Link>
          </span>
        </div>
        <div className="mr-10 grow basis-0 overflow-hidden pr-4">
          <div>
            <div
              className="max-w-[calc(100%_-_26px] inline-block break-words"
              style={{ wordBreak: "break-word" }}
            >
              <div className="relative inline-flex w-full align-middle">
                <div className="base-[auto] w-full min-w-0 shrink grow">
                  <div
                    className="relative inline-block max-w-full whitespace-normal break-words rounded-2xl bg-zinc-100 text-gray-900"
                    style={{ wordBreak: "break-word" }}
                  >
                    <div className="py-2 pl-4 pr-7">
                      <span>
                        <span className="inline">
                          <Link
                            className="inline bg-zinc-100"
                            href={`/profile/`}
                          >
                            <span className="inline-flex">
                              <span
                                className="max-w-full text-[15px] font-semibold capitalize text-gray-900 underline-offset-1 hover:underline"
                                style={{ wordBreak: "break-word" }}
                              >
                                {comment.user?.name}
                              </span>
                            </span>
                          </Link>
                        </span>
                      </span>
                      <div className="block pb-[4px] pt-[4px]">
                        <span
                          className="break-words"
                          style={{ wordBreak: "break-word" }}
                        >
                          <div
                            className="text-sm"
                            style={{ wordBreak: "break-word" }}
                          >
                            <div dir="auto" className="text-start font-sans">
                              {comment.comment}
                            </div>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-2 -bottom-2 ">
                    <div className="relative flex items-center rounded-full bg-white px-1 shadow">
                      {isLiked || comment._count.likeComment > 0 ? (
                        <div className="rounded-full">
                          <AiFillLike className="h-4 w-4 text-primary" />
                        </div>
                      ) : null}

                      {isLikeLoading ? (
                        <Loader
                          classNameContainer="bottom-[-7px] left-[-13px] absolute text-gray-800"
                          classNameIcon="h-3 w-3 animate-spin"
                        />
                      ) : (
                        comment._count.likeComment !== 0 && (
                          <span className="text-sm font-bold text-gray-700">
                            {comment._count.likeComment}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-3 flex gap-2 text-xs font-semibold text-gray-600">
                <Button
                  onClick={handleLikeComment}
                  className={classNames(
                    "underline-offset-1 hover:underline",
                    isLiked
                      ? "font-bold text-primary"
                      : "font-normal text-gray-600"
                  )}
                >
                  Like
                </Button>
                <Button
                  onClick={() => setIsReplyOpen(true)}
                  className="underline-offset-1 hover:underline"
                >
                  Reply
                </Button>
                <span className="text-xs text-gray-700">
                  <ReactTimeAgo
                    timeStyle="twitter"
                    locale="en-US"
                    date={comment.createdAt}
                  />
                </span>
              </div>
              {comment._count.reply !== 0 && !isReplyOpen ? (
                <div className="mt-2 ml-3">
                  <div className="absolute left-[42px] h-[13px] w-[27px] rounded-l-md border-l-2 border-b-2 border-gray-300 border-t-white"></div>
                  <button
                    onClick={() => setIsReplyOpen(true)}
                    className="flex items-center gap-1 text-sm font-semibold underline-offset-1 hover:underline"
                  >
                    <span>
                      <BsArrow90DegDown className="-rotate-90" />
                    </span>
                    <span>{`${comment._count.reply} replies`}</span>
                  </button>
                </div>
              ) : null}
            </div>

            {isReplyOpen && (
              <ReplyComment
                commentId={comment.id}
                commentName={comment.user?.name}
              />
            )}
          </div>
        </div>
        <div className="w-1/2] absolute top-0 right-0 h-0">
          {isModalOpen && (
            <div
              ref={ref}
              className="absolute top-12 right-3 z-30 h-auto rounded border border-solid border-gray-600 bg-gray-800 shadow-xl md:top-[21px] md:right-[60px]"
            >
              <ModalComment
                handleEdit={handleUpdateComment}
                handleDelete={handleDeleteComment}
              />
            </div>
          )}
          {session?.user?.id === comment.userId && (
            <div className="absolute top-3 right-5 self-end">
              <Button
                onClick={() => setIsModalOpen((prev) => !prev)}
                className="rounded-full p-1 text-gray-800 transition hover:bg-zinc-200"
                aria-label="action list"
              >
                <BiDotsHorizontalRounded aria-hidden="true" size={22} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
