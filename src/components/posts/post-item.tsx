import Button from "@/components/shared/button";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { ImSpinner8 } from "react-icons/im";
import { BiComment } from "react-icons/bi";
import { IoMdShareAlt } from "react-icons/io";
import { useSession } from "next-auth/react";
import Link from "next/link";
import classNames from "classnames";
import { motion } from "framer-motion";
import Image from "../shared/image";
import {
  variants,
  capitalizeName,
  getImageHeightRatio,
  getImageWidthRatio,
} from "@/utils/index";
import type { Post as PostType, User } from "@/types/types";
import Comments from "../comments";
import React, { useRef, useState } from "react";
import usePostStore from "@/store/post";
import ModalPost from "../modal/modal-post";
import { trpc } from "@/utils/trpc";
import useClickOutside from "hooks/useClickOutside";
import { toast } from "react-toastify";

type PostItemProps = {
  post: PostType<User>;
};

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const utils = trpc.useContext();
  const ref = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setPostOpen = usePostStore((store) => store.setPostOpen);
  const setCurrentPostId = usePostStore((store) => store.setCurrentPostId);
  const setIsEditing = usePostStore((store) => store.setIsEditing);

  const { mutate: mutateDelete, isLoading: isDeleteLoading } =
    trpc.post.deletePost.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await utils.post.getPosts.invalidate();
        toast("Your post was added successfully", {
          type: "success",
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      },
    });

  const { mutate: mutateLike, isLoading: isLikeLoading } =
    trpc.like.likePost.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await utils.post.getPosts.invalidate();
      },
    });

  const handleUpdatePost = () => {
    setPostOpen(true);
    setCurrentPostId(post.id);
    setIsEditing(true);
    setIsModalOpen(false);
  };

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutateLike({ postId: post.id });
  };

  const handleDeletePost = () => {
    setIsModalOpen(false);
    mutateDelete({ id: post.id });
  };

  useClickOutside(ref, () => setIsModalOpen(false));

  return (
    <motion.div
      initial="hidden"
      variants={variants}
      animate="visible"
      exit="hidden"
      className="relative z-10 mt-2 flex flex-col gap-1 overflow-hidden rounded-md border border-gray-200 bg-white"
    >
      <div className="flex gap-3 p-3">
        <Link
          href={`/profile/${session?.user?.id || ""}`}
          aria-label={session?.user?.name || ""}
        >
          <div className="relative h-11 w-11">
            <Image
              src="/default-image.png"
              alt={session?.user?.image || ""}
              className="mx-0 rounded-full"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </Link>
        <div className="mr-auto flex flex-col self-center leading-none">
          <Link
            href={`/profile/${session?.user?.id || ""}`}
            className="block text-base font-semibold capitalize text-black"
            aria-label={session?.user?.name || ""}
          >
            {post.name}
          </Link>
          <span className="text-xs text-gray-700">a second ago</span>
        </div>

        <div ref={ref} className="self-end">
          <div>
            <Button
              onClick={() => setIsModalOpen((prev) => !prev)}
              className="rounded-full p-1 text-gray-800 hover:bg-zinc-200"
              aria-label="action list"
            >
              <BiDotsHorizontalRounded aria-hidden="true" size={26} />
            </Button>
          </div>
        </div>
      </div>
      <div className="px-3 font-normal md:px-5">
        <span className="break-words">{post.message}</span>
      </div>
      {post.selectedFile.length !== 0 && (
        <div
          className={classNames(
            "relative grid gap-1",
            post.selectedFile.length > 1 && "!grid-cols-2"
          )}
        >
          {post.selectedFile.map((image, index) => {
            const widthRatio = getImageWidthRatio(
              post.selectedFile.length,
              index
            );
            const heightRatio = getImageHeightRatio(
              post.selectedFile.length,
              index
            );

            return (
              <div
                key={image.id}
                className={classNames(
                  "relative cursor-pointer overflow-hidden rounded",
                  post.selectedFile.length === 3 && index === 0 && "col-span-2",
                  post.selectedFile.length === 3 && index === 2 && "self-end"
                )}
              >
                <div className="relative h-full">
                  <Image
                    src={image.url}
                    layout="responsive"
                    height={heightRatio}
                    width={widthRatio}
                    objectFit="cover"
                    alt={image.id}
                    unoptimized
                    quality={100}
                    containerclassnames="opacity-100 h-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-3 flex items-center justify-between px-5">
        <div className="flex items-center gap-1 text-sm text-black">
          {post._count.likes !== 0 && (
            <React.Fragment>
              <AiFillHeart aria-hidden="true" size={17} />
              {isLikeLoading ? (
                <div className="text-xs">
                  <ImSpinner8 className="animate-spin" />
                </div>
              ) : (
                <span className="font-semibold text-gray-800">
                  {post._count.likes}
                  <span className="ml-2 text-xs">
                    {post.isLike
                      ? `${
                          capitalizeName(session?.user?.name as string) || ""
                        } ${post._count.likes > 1 ? "and others" : ""}`
                      : ""}
                  </span>
                </span>
              )}
            </React.Fragment>
          )}
        </div>
        <div className="flex gap-1 text-sm text-gray-400">
          <span>{post._count.comment}</span>
          <BiComment aria-hidden="true" size={20} />
        </div>
      </div>
      <div className="mt-1 flex justify-between border-t border-gray-200 font-light shadow">
        <Button
          className="flex flex-1 items-center justify-center gap-1 rounded-md py-2 px-6 text-gray-600	hover:bg-[#edf1f5]"
          aria-label="Like Post"
          onClick={handleLikePost}
        >
          {post.isLike ? (
            <React.Fragment>
              <motion.span>
                <AiFillHeart
                  aria-hidden="true"
                  size={21}
                  className="text-red-600"
                />
              </motion.span>
              <span className={classNames("text-sm font-bold text-red-600")}>
                Like
              </span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <AiOutlineHeart
                aria-hidden="true"
                size={20}
                className="text-black"
              />
              <span
                className={classNames("text-sm font-semibold text-gray-600")}
              >
                Like
              </span>
            </React.Fragment>
          )}
        </Button>
        <Button
          onClick={() => setIsCommentOpen(true)}
          className={`flex flex-1 items-center justify-center gap-1 border-x border-gray-200 py-2 px-6 text-gray-600 hover:bg-[#edf1f5]`}
          aria-label="Leave a Comment"
        >
          <BiComment aria-hidden="true" size={20} />
          <span className="text-sm font-semibold text-gray-600">Comment</span>
        </Button>
        <Button
          aria-label="Share a post"
          className="flex flex-1 items-center justify-center gap-1 rounded-md py-2 px-6 text-gray-600 hover:bg-[#edf1f5]"
        >
          <IoMdShareAlt aria-hidden="true" size={20} />
          <span className="text-sm font-semibold text-gray-600">Share</span>
        </Button>
      </div>
      {isDeleteLoading && (
        <div className="absolute top-14 right-5 z-30">
          <ImSpinner8 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {isCommentOpen && <Comments postId={post.id} />}
      {isModalOpen && (
        <ModalPost
          ref={ref}
          handleEdit={handleUpdatePost}
          handleDelete={handleDeletePost}
        />
      )}
    </motion.div>
  );
};

export default PostItem;
