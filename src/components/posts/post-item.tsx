import Button from "@/components/shared/button"
import { BiDotsHorizontalRounded } from "react-icons/bi"
import { AiFillLike, AiOutlineLike } from "react-icons/ai"
import { ImSpinner8 } from "react-icons/im"
import { BiComment } from "react-icons/bi"
import { IoMdShareAlt } from "react-icons/io"
import { useSession } from "next-auth/react"
import Link from "next/link"
import classNames from "classnames"
import { motion } from "framer-motion"
import Image from "@/components/shared/image"
import {
  variants,
  getImageHeightRatio,
  getImageWidthRatio,
} from "@/lib/utils/index"
import type { Post as PostType, User } from "@/types/types"
import Comments from "@/components/comments/"
import usePostStore from "@/store/post"
import ModalPost from "@/components/modal/modal-post"
import { trpc } from "@/lib/utils/trpc"
import useClickOutside from "@/lib/hooks/useClickOutside"
import { useRouter } from "next/router"
import dayjs from "@/lib/utils/time"
import React, { useCallback, useRef, useState } from "react"

type PostItemProps = {
  post: PostType<User>
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const utils = trpc.useContext()
  const router = useRouter()
  const ref = useRef<HTMLDivElement | null>(null)
  const { data: session } = useSession()
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(post.isLike)
  const setPostOpen = usePostStore((store) => store.setPostOpen)
  const setCurrentPostId = usePostStore((store) => store.setCurrentPostId)
  const setIsEditing = usePostStore((store) => store.setIsEditing)
  const setSelectedPost = usePostStore((store) => store.setSelectedPost)
  const setIsModalDeletePostOpen = usePostStore(
    (store) => store.setIsModalDeletePostOpen
  )

  const { mutate: mutateLike, isLoading: isLikeLoading } =
    trpc.like.likePost.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await utils.post.getPosts.invalidate()
      },
    })

  const handleUpdatePost = () => {
    setPostOpen(true)
    setCurrentPostId(post.id)
    setSelectedPost({
      id: post.id,
      message: post.message,
      selectedFile: post.selectedFile,
    })
    setIsEditing(true)
    setIsModalOpen(false)
  }

  const handleLikePost = () => {
    mutateLike({ postId: post.id, isLiked: !isLiked })
    setIsLiked(!isLiked)
  }

  const handleDeletePost = () => {
    setIsModalOpen(false)
    setIsModalDeletePostOpen(true)
    setCurrentPostId(post.id)
  }

  const hideModalPost = useCallback(() => setIsModalOpen(false), [])

  useClickOutside(ref, () => hideModalPost())

  const handleOpenModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <motion.li
      initial="hidden"
      variants={variants}
      animate="visible"
      exit="hidden"
      className="relative z-10 flex flex-col gap-1 overflow-hidden rounded-md bg-white shadow "
    >
      <div className="flex gap-3 p-3">
        <Link
          href={`/profile/${post.userId}`}
          aria-label={post.user.name}
          className={classNames(
            "rounded-full ring-primary ring-offset-1 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary active:ring"
          )}
        >
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
            className={classNames(
              "block rounded-full text-base font-semibold capitalize text-zinc-900",
              "ring-primary ring-offset-1 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary active:ring"
            )}
            aria-label={post.user.name}
          >
            {post.name}
          </Link>
          <span className="text-xs text-zinc-700">
            {dayjs(post.createdAt).fromNow(true)}
          </span>
        </div>
        {session?.user?.id === post.userId && (
          <div ref={ref} className="self-end">
            <div>
              <Button
                type="button"
                onClick={handleOpenModal}
                className={classNames(
                  "rounded-full p-1 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 active:scale-110 active:bg-zinc-300",
                  "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
                )}
                aria-label="open modal post"
              >
                <BiDotsHorizontalRounded aria-hidden="true" size={26} />
              </Button>
            </div>
            {isModalOpen && (
              <ModalPost
                handleEdit={handleUpdatePost}
                handleDelete={handleDeletePost}
              />
            )}
          </div>
        )}
      </div>
      <div className="px-3 font-normal md:px-5">
        <span className="break-words text-base">{post.message}</span>
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
            )
            const heightRatio = getImageHeightRatio(
              post.selectedFile.length,
              index
            )

            return (
              <div
                key={image.id}
                className={classNames(
                  "relative cursor-pointer overflow-hidden rounded",
                  post.selectedFile.length === 3 && index === 0 && "col-span-2",
                  post.selectedFile.length === 3 && index === 2 && "self-end"
                )}
              >
                <div
                  className="relative h-full cursor-pointer active:opacity-80"
                  tabIndex={0}
                  role="button"
                  aria-label={image.id}
                  onClick={() => router.push(`/post/${post.id}`)}
                >
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
            )
          })}
        </div>
      )}
      <div className="mt-2 flex items-center justify-between px-5">
        <div className="flex items-center gap-1 text-sm text-black">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
            <AiFillLike aria-hidden size={13} className="text-white" />
          </span>
          {post._count.likes !== 0 && (
            <React.Fragment>
              {isLikeLoading ? (
                <ImSpinner8 aria-hidden className="h-3 w-3 animate-spin" />
              ) : (
                <span className=" font-normal text-zinc-800">
                  {post._count.likes}
                </span>
              )}
            </React.Fragment>
          )}
        </div>
        <div className="flex gap-1 text-sm font-semibold text-zinc-500">
          <span>{post._count.comment}</span>
          <BiComment aria-hidden size={20} />
        </div>
      </div>
      <ul className="rou mx-1 mt-1 flex justify-between rounded-t-md border-t border-zinc-200 font-light">
        <li className="w-full flex-1 py-1">
          <Button
            type="button"
            className={classNames(
              "flex h-[35px] w-full items-center justify-center gap-1 rounded-md text-zinc-600	hover:bg-zinc-100 active:scale-110",
              "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
            )}
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
                  className="text-zinc-900"
                />
                <span
                  className={classNames("text-sm font-semibold text-zinc-800")}
                >
                  Like
                </span>
              </React.Fragment>
            )}
          </Button>
        </li>

        <li className="w-full flex-1 py-1">
          <Button
            type="button"
            onClick={() => setIsCommentOpen(true)}
            className={classNames(
              "flex h-[35px] w-full items-center justify-center gap-1 text-zinc-600 hover:bg-zinc-100",
              "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
            )}
            aria-label="Leave a Comment"
          >
            <BiComment aria-hidden="true" size={20} className="text-zinc-900" />
            <span className="text-sm font-semibold text-zinc-800">Comment</span>
          </Button>
        </li>
        <li className="w-full flex-1 py-1">
          <Button
            type="button"
            aria-label="Share a post"
            className={classNames(
              "flex h-[35px] w-full items-center justify-center gap-1 rounded-md text-zinc-600 hover:bg-zinc-100 ",
              "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
            )}
          >
            <IoMdShareAlt
              aria-hidden="true"
              size={20}
              className="text-zinc-900"
            />
            <span className="text-sm font-semibold text-zinc-800">Share</span>
          </Button>
        </li>
      </ul>
      {isCommentOpen && <Comments postId={post.id} />}
    </motion.li>
  )
}

export default PostItem
