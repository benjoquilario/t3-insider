import Image from "../shared/image";
import Link from "next/link";
import Button from "../shared/button";
import ModalComment from "../modal/modal-comment";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import useCommentStore from "@/store/comment";
import type { ReplyComment, User } from "@/types/types";
import type { UseFormSetFocus } from "react-hook-form";
import ReactTimeAgo from "react-time-ago";
import classNames from "classnames";
import { trpc } from "@/utils/trpc";
import { AiFillLike } from "react-icons/ai";
import Loader from "../shared/loader";
import React, { useState, useRef, useMemo } from "react";

type ReplyItemProps = {
  comment: ReplyComment<User>;
  setFocus: UseFormSetFocus<{ replyComment: string }>;
  commentId: string;
};

const ReplyItem: React.FC<ReplyItemProps> = ({
  comment,
  setFocus,
  commentId,
}) => {
  const utils = trpc.useContext();
  const ref = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setReplyId = useCommentStore((store) => store.setReplyId);
  const [isLiked, setIsLiked] = useState(false);
  const setReplyComment = useCommentStore((store) => store.setReplyComment);

  const replyLike = useMemo(
    () =>
      comment.likeReplyComments.find((reply) => reply.replyId === comment.id),
    [comment]
  );

  const handleUpdateReplyComment = () => {
    setReplyId(comment.id);
    setIsModalOpen(false);
    setReplyComment(comment.comment);
    setFocus("replyComment");
  };

  const { mutate: mutateLikeReplyComent, isLoading: isLikeLoading } =
    trpc.like.likeReplyComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await utils.comment.getReplyComments.invalidate({
          limit: 3,
          commentId: commentId,
        });
      },
    });

  const handleLikeReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutateLikeReplyComent({
      replyId: comment.id,
      id: replyLike?.id,
      isLiked: !isLiked,
    });
    setIsLiked(!isLiked);
  };

  return (
    <li>
      <div className="absolute left-[42px] h-[30px] w-[53px] rounded-l-md border-l-2 border-b-2 border-gray-300 border-t-white"></div>
      <div className="group relative flex pt-2 pl-6">
        <div className="relative mt-1 mr-2 block rounded-full">
          <span className="inline">
            <Link
              href={`/profile/${comment.userId}`}
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
        <div className="grow basis-0 overflow-hidden pr-4">
          <div>
            <div
              className="max-w-[calc(100%_-_26px] inline-block break-words"
              style={{ wordBreak: "break-word" }}
            >
              <div className="relative inline-flex w-full align-middle">
                <div className="base-[auto] w-full min-w-0 shrink grow">
                  <div
                    className="relative inline-block max-w-full whitespace-normal break-words rounded-2xl bg-zinc-100 text-black"
                    style={{ wordBreak: "break-word" }}
                  >
                    <div className="px-[14px] py-[6px]">
                      <span>
                        <span className="inline">
                          <Link
                            className="inline bg-zinc-100"
                            href={`/profile/`}
                          >
                            <span className="inline-flex">
                              <span
                                className="max-w-full text-sm font-semibold capitalize text-black"
                                style={{ wordBreak: "break-word" }}
                              >
                                {comment.user.name}
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
                    <div className="flex items-center rounded-full bg-white px-1 shadow">
                      {isLiked || comment._count.likeReplyComments > 0 ? (
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
                        comment._count.likeReplyComments !== 0 && (
                          <span className="text-sm font-bold text-gray-700">
                            {comment._count.likeReplyComments}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-3 flex gap-2 text-xs font-semibold text-gray-600">
                <Button
                  onClick={handleLikeReply}
                  className={classNames(
                    "underline-offset-1 hover:underline",
                    isLiked
                      ? "font-bold text-primary"
                      : "font-normal text-gray-600"
                  )}
                >
                  Like
                </Button>
                <span className="text-xs text-gray-700">
                  <ReactTimeAgo
                    timeStyle="twitter"
                    locale="en-US"
                    date={comment.createdAt}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2] absolute top-0 right-0 h-0">
          {isModalOpen && (
            <div
              ref={ref}
              className="absolute top-12 right-3 z-30 h-auto rounded border border-solid border-gray-600 bg-gray-800  shadow-xl  md:top-[21px] md:right-[60px]"
            >
              <ModalComment
                handleEdit={handleUpdateReplyComment}
                // handleDelete={handleDeleteComment}
              />
            </div>
          )}
          <div className="absolute top-3 right-5 self-end">
            <Button
              onClick={() => setIsModalOpen((prev) => !prev)}
              className="rounded-full p-1 text-gray-800 opacity-0 transition group-hover:opacity-100 hover:bg-zinc-200"
              aria-label="action list"
            >
              <BiDotsHorizontalRounded aria-hidden="true" size={22} />
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ReplyItem;