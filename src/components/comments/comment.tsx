import React, { useState, useRef } from "react";
import Button from "../shared/button";
import Link from "next/link";
import Image from "../shared/image";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import ModalComment from "../modal/modal-comment";
import useClickOutside from "hooks/useClickOutside";
import { trpc } from "@/utils/trpc";
import usePostStore from "@/store/post";
import type { Comment as CommentType, User } from "@/types/types";

type CommentProps = {
  comment: CommentType<User>;
};

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const utils = trpc.useContext();
  const ref = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setCommentId = usePostStore((store) => store.setCommentId);

  useClickOutside(ref, () => setIsModalOpen(false));

  const { mutate, isLoading } = trpc.comment.deleteComment.useMutation({
    onError: (e) => console.log(e.message),
    onSuccess: async () => {
      await utils.comment.getComments.invalidate();
    },
  });

  const handleDeleteComment = () => {
    mutate({ id: comment.id });
  };

  const handleUpdateComment = () => {
    setCommentId(comment.id);
  };

  return (
    <div>
      <div className="relative flex pt-2 pl-6">
        <div className="relative mt-1 mr-2 block rounded-full">
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
                    className="relative inline-block max-w-full whitespace-normal break-words rounded-2xl bg-zinc-100 text-black"
                    style={{ wordBreak: "break-word" }}
                  >
                    <div className="py-[6px] px-[12px]">
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
                                {comment.user?.name}
                              </span>
                            </span>
                          </Link>
                          <span className="ml-2 text-xs text-gray-600">·</span>
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
                </div>
              </div>
              <div className="ml-3 flex gap-2 text-xs font-semibold text-gray-600">
                <button>Like</button>
                <button>Reply</button>
              </div>
            </div>
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
          <div className="absolute top-3 right-5 self-end">
            <Button
              onClick={() => setIsModalOpen((prev) => !prev)}
              className="rounded-full p-1 text-gray-800 transition hover:bg-zinc-200"
              aria-label="action list"
            >
              <BiDotsHorizontalRounded aria-hidden="true" size={22} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
