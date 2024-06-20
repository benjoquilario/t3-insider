"use client"

import React from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BiDotsHorizontalRounded } from "react-icons/bi"
import { BsArrow90DegDown } from "react-icons/bs"
import { AiFillLike } from "react-icons/ai"
import type { User } from "@prisma/client"
import { SlLike } from "react-icons/sl"
import dayjs from "@/lib/time"

type CommentItemProps = {
  comment: IComment<User>
}

const CommentItem = (props: CommentItemProps) => {
  const { comment } = props

  return (
    <>
      <div className="relative flex pl-4 pt-1 md:pl-6">
        <div className="relative mr-2 mt-1 block rounded-full">
          {/* {isReplyOpen || comment._count.reply > 0 ? (
            <div className="absolute left-[18px] top-[30px] h-[calc(100%_-_61px)] w-[2px] bg-gray-300"></div>
          ) : null} */}
          <span className="inline">
            <Link
              href={`/profile/`}
              className="relative inline-block w-full shrink basis-[auto] items-stretch"
              // aria-label={comment.user?.name}
            >
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="pointer-events-none absolute inset-0 rounded-full"></div>
            </Link>
          </span>
        </div>

        <div className="mr-6 grow basis-0 overflow-hidden pr-2 md:mr-10 md:pr-4">
          <div>
            <div
              className="max-w-[calc(100%_-_26px] inline-block break-words"
              style={{ wordBreak: "break-word" }}
            >
              <div className="relative inline-flex w-full align-middle">
                <div className="base-[auto] w-full min-w-0 shrink grow">
                  <div
                    className="relative inline-block max-w-full whitespace-normal break-words rounded-2xl bg-secondary text-foreground"
                    style={{ wordBreak: "break-word" }}
                  >
                    <div className="py-2 pl-4 pr-7">
                      <span>
                        <span className="inline">
                          <Link
                            className="inline bg-secondary"
                            href={`/profile/${comment.userId}`}
                          >
                            <span className="inline-flex">
                              <span
                                className="max-w-full text-sm font-medium capitalize text-foreground underline-offset-1 hover:underline"
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

                  <div className="absolute -bottom-2 -right-2">
                    <div className="relative flex items-center gap-1 rounded-full bg-background px-1 shadow">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                        <AiFillLike size={12} className="text-white" />
                      </div>

                      <span className="text-sm font-medium text-foreground/70">
                        4
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-1 mt-2 flex gap-2 text-xs font-semibold text-muted-foreground/70">
                <span className="text-xs text-foreground/70">
                  {dayjs(comment.createdAt).fromNow(true)}
                </span>
                <button
                  type="button"
                  // onClick={handleLikeComment}
                  className="underline-offset-1 hover:underline"
                >
                  Like
                </button>
                <button
                  // type="button"
                  // onClick={() => setIsReplyOpen(true)}
                  className="underline-offset-1 hover:underline"
                >
                  Reply
                </button>
              </div>

              <div className="ml-3 mt-2">
                <div className="absolute bottom-[12px] left-[42px] h-[21px] w-[27px] rounded-l border-b-2 border-l-2 border-l-secondary border-t-secondary"></div>
                <Button
                  variant="ghost"
                  aria-label="show replies"
                  className="flex items-center gap-1 text-sm font-semibold underline-offset-1 hover:underline"
                >
                  <span>
                    <BsArrow90DegDown className="-rotate-90" />
                  </span>
                  <span>4 replies</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-0 w-1/2">
          {/* {isModalOpen && (
            <div className="absolute right-3 top-12 z-30 h-auto rounded border border-solid border-zinc-200 bg-zinc-100 shadow-xl md:right-[60px] md:top-[21px]">
              <ModalComment
                handleEdit={handleUpdateComment}
                handleDelete={handleDeleteComment}
              />
            </div>
          )} */}
          {/* {session?.user?.id === comment.userId && ( */}
          <div className="absolute right-5 top-3 self-end">
            <Button
              variant="ghost"
              // type="button"
              // onClick={handleModalOpen}
              className="rounded-full p-1 px-2 text-foreground/80 transition hover:bg-secondary/90"
              aria-label="show post modal"
            >
              <BiDotsHorizontalRounded aria-hidden="true" size={22} />
            </Button>
          </div>
          {/* )} */}
        </div>
      </div>
    </>
  )
}

export default CommentItem
