import Button from "@/components/shared/button";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiFillLike,
  AiOutlineLike,
} from "react-icons/ai";
import { ImSpinner8 } from "react-icons/im";
import { BiComment } from "react-icons/bi";
import { IoMdShareAlt } from "react-icons/io";
import { useSession } from "next-auth/react";
import Link from "next/link";
import classNames from "classnames";
import { motion } from "framer-motion";
import Image from "@/components/shared/image";
import {
  variants,
  capitalizeName,
  getImageHeightRatio,
  getImageWidthRatio,
} from "@/utils/index";
import type { Post as PostType, User } from "@/types/types";
import Comments from "@/components/comments/";
import React, { useMemo, useRef, useState } from "react";
import usePostStore from "@/store/post";
import ModalPost from "@/components/modal/modal-post";
import { trpc } from "@/utils/trpc";
import useClickOutside from "hooks/useClickOutside";
import ReactTimeAgo from "react-time-ago";
import en from "javascript-time-ago/locale/en.json";
import TimeAgo from "javascript-time-ago";

TimeAgo.addDefaultLocale(en);

type PostItemProps = {
  post: PostType<User>;
};

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const utils = trpc.useContext();
  const ref = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLike);
  const setPostOpen = usePostStore((store) => store.setPostOpen);
  const setCurrentPostId = usePostStore((store) => store.setCurrentPostId);
  const setIsEditing = usePostStore((store) => store.setIsEditing);
  const setIsModalDeletePostOpen = usePostStore(
    (store) => store.setIsModalDeletePostOpen
  );

  const likes = useMemo(
    () => post.likes.find((like) => like.postId === post.id),
    [post]
  );

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
    mutateLike({ postId: post.id, id: likes?.id, isLiked: !isLiked });
    setIsLiked(!isLiked);
  };

  const handleDeletePost = () => {
    setIsModalOpen(false);
    setIsModalDeletePostOpen(true);
    setCurrentPostId(post.id);
  };

  useClickOutside(ref, () => setIsModalOpen(false));

  return (
    <motion.li
      initial="hidden"
      variants={variants}
      animate="visible"
      exit="hidden"
      className="relative z-10 mt-2 flex flex-col gap-1 overflow-hidden rounded-md border border-gray-200 bg-white"
    >
      <div className="flex gap-3 p-3">
        <Link href={`/profile/${post.userId}`} aria-label={post.user.name}>
          <div className="relative h-11 w-11">
            <Image
              src={post.user.image || "/default-image.png"}
              alt={post.user.name}
              className="mx-0 rounded-full"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </Link>
        <div className="mr-auto flex flex-col self-center leading-none">
          <Link
            href={`/profile/${post.userId}`}
            className="block text-base font-semibold capitalize text-black"
            aria-label={post.user.name}
          >
            {post.name}
          </Link>
          <span className="text-xs text-gray-700">
            <ReactTimeAgo date={post.createdAt} />
          </span>
        </div>
        {session?.user?.id === post.userId && (
          <div ref={ref} className="self-end">
            <div>
              <Button
                onClick={() => setIsModalOpen((prev) => !prev)}
                className="rounded-full p-1 text-gray-800 hover:bg-[#edf1f5]"
                aria-label="action list"
              >
                <BiDotsHorizontalRounded aria-hidden="true" size={26} />
              </Button>
            </div>
          </div>
        )}
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
      <div className="mt-2 flex items-center justify-between px-5">
        <div className="flex items-center gap-1 text-sm text-black">
          <AiFillLike aria-hidden="true" size={17} />
          {post._count.likes !== 0 && (
            <React.Fragment>
              {isLikeLoading ? (
                <ImSpinner8 className="h-3 w-3 animate-spin" />
              ) : (
                <span className="font-semibold text-gray-800">
                  {post._count.likes}
                </span>
              )}
            </React.Fragment>
          )}
        </div>
        <div className="flex gap-1 text-sm font-semibold text-gray-400">
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
          {isLiked ? (
            <React.Fragment>
              <motion.span>
                <AiFillLike
                  aria-hidden="true"
                  size={21}
                  className="text-primary"
                />
              </motion.span>
              <span className={classNames("text-sm font-bold text-primary")}>
                Like
              </span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <AiOutlineLike
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
      {isCommentOpen && <Comments postId={post.id} />}
      {isModalOpen && (
        <ModalPost
          ref={ref}
          handleEdit={handleUpdatePost}
          handleDelete={handleDeletePost}
        />
      )}
    </motion.li>
  );
};

export default PostItem;
