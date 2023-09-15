import Image from "@/components/shared/image"
import Link from "next/link"
import Button from "@/components/shared/button"
import ModalComment from "@/components/modal/modal-comment"
import { BiDotsHorizontalRounded } from "react-icons/bi"
import useCommentStore from "@/store/comment"
import type { ReplyComment, User } from "@/types/types"
import type { UseFormSetFocus } from "react-hook-form"
import classNames from "classnames"
import { AiFillLike } from "react-icons/ai"
import Loader from "@/components/shared/loader"
import useClickOutside from "@/lib/hooks/useClickOutside"
import { useMutationLikeReply } from "@/lib/hooks/useLikeMutation"
import dayjs from "@/lib/utils/time"
import React, { useState, useRef, useCallback } from "react"

type ReplyItemProps = {
  comment: ReplyComment<User>
  setFocus: UseFormSetFocus<{ comment: string }>
  commentId: string
}

const ReplyItem: React.FC<ReplyItemProps> = ({
  comment,
  setFocus,
  commentId,
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const setReplyId = useCommentStore((store) => store.setReplyId)
  const [isLiked, setIsLiked] = useState(false)
  const setReplyComment = useCommentStore((store) => store.setReplyComment)

  const handleUpdateReplyComment = () => {
    setReplyId(comment.id)
    setIsModalOpen(false)
    setReplyComment(comment.comment)
    setFocus("comment")
  }

  const { mutateLikeReplyComent, isLikeLoading } =
    useMutationLikeReply(commentId)

  const handleLikeReply = () => {
    mutateLikeReplyComent({
      replyId: comment.id,
      isLiked: !isLiked,
    })
    setIsLiked(!isLiked)
  }

  const hideModalReply = useCallback(() => setIsModalOpen(false), [])

  useClickOutside(ref, () => hideModalReply())

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <li>
      <div className="absolute left-[32px] h-[30px] w-[53px] rounded-l-md border-b-2 border-l-2 border-zinc-300 border-t-white md:left-[42px]" />
      <div className="group relative flex pl-4 pt-2 md:pl-6">
        <div className="relative mr-2 mt-1 block rounded-full">
          <span className="inline">
            <Link
              href={`/profile/${comment.userId}`}
              className="relative inline-block w-full shrink basis-[auto] items-stretch"
            >
              <div className="relative inline-block">
                <Image
                  className="h-9 w-9 rounded-full object-cover"
                  src={comment.user.image || "/default-image.png"}
                  alt={comment.user.name}
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
                  <div className="absolute -bottom-2 -right-2 ">
                    <div className="flex items-center gap-1 rounded-full bg-white px-1 shadow">
                      {isLiked || comment._count.likeReplyComments > 0 ? (
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                          <AiFillLike size={12} className="text-white" />
                        </div>
                      ) : null}
                      {isLikeLoading ? (
                        <Loader
                          classNameContainer="bottom-[-7px] left-[-13px] absolute text-zinc-800"
                          classNameIcon="h-3 w-3 animate-spin"
                        />
                      ) : (
                        comment._count.likeReplyComments !== 0 && (
                          <span className="text-sm font-medium text-zinc-700">
                            {comment._count.likeReplyComments}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-3 flex gap-2 text-xs font-semibold text-zinc-600">
                <Button
                  onClick={handleLikeReply}
                  className={classNames(
                    "underline-offset-1 hover:underline",
                    isLiked
                      ? "font-bold text-primary"
                      : "font-normal text-zinc-600"
                  )}
                >
                  Like
                </Button>
                <span className="text-xs text-zinc-700">
                  {dayjs(comment.createdAt).fromNow(true)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div ref={ref} className="w-1/2] absolute right-0 top-0 h-0">
          {isModalOpen && (
            <div className="absolute right-3 top-12 z-30 h-auto rounded border border-solid border-zinc-200 bg-zinc-100  shadow-xl  md:right-[60px] md:top-[21px]">
              <ModalComment
                handleEdit={handleUpdateReplyComment}
                // handleDelete={handleDeleteComment}
              />
            </div>
          )}
          <div className="absolute right-5 top-3 self-end">
            <Button
              onClick={handleModalOpen}
              className="rounded-full p-1 text-zinc-800 opacity-0 transition group-hover:opacity-100 hover:bg-zinc-200"
              aria-label="action list"
            >
              <BiDotsHorizontalRounded aria-hidden="true" size={22} />
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}

export default ReplyItem
