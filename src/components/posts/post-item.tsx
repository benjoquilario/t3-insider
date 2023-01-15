import Image from "next/legacy/image";
import Button from "@/components/shared/button";
import { BiDotsHorizontalRounded, BiMessageDots } from "react-icons/bi";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaShare } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Link from "next/link";
import classNames from "classnames";
import React from "react";

const PostItem = ({ post }) => {
  const session = useSession();

  return (
    <div className="relative z-10 mt-3 flex flex-col gap-1 overflow-hidden rounded-md bg-white shadow">
      <div className="flex gap-3 p-3">
        <Link
          href={`/profile/${session.data?.user?.id as string}`}
          aria-label={session.data?.user?.name as string}
        >
          <div className="relative h-11 w-11">
            <Image
              src="/default-image.png"
              alt={session.data?.user?.image as string}
              className="mx-0 rounded-full"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </Link>
        <div className="mr-auto flex flex-col self-center leading-none">
          <Link
            href={`/profile/${session.data?.user?.id as string}`}
            className="block text-base font-semibold text-black"
            aria-label={session.data?.user?.name as string}
          >
            {post.name}
          </Link>
          <span className="text-xs text-gray-700">a second ago</span>
        </div>

        <div className="self-end">
          <div>
            <Button
              className="rounded-full p-1 text-white hover:bg-gray-700"
              aria-label="action list"
            >
              <BiDotsHorizontalRounded aria-hidden="true" size={26} />
            </Button>
          </div>
        </div>
      </div>
      <div className="px-3 font-normal md:px-5">
        <span>{post.message}</span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.selectedFile}
        className="w-full rounded object-cover"
        alt={post.message}
      />
      <div className="mt-3 flex items-center justify-between px-5">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <AiOutlineLike aria-hidden="true" size={17} />
          <span>{21}</span>
        </div>
        <div className="text-sm text-gray-400">
          <span>{`${12}`} Comment</span>
        </div>
      </div>
      <div className="mt-1 flex justify-around gap-3 pl-3 font-light shadow">
        <Button
          className="flex flex-1 items-center justify-center gap-1 rounded-md py-2 px-6 text-gray-600 hover:bg-[#edf1f5]"
          aria-label="Like Post"
        >
          <AiFillLike />
          <span className={classNames("text-xs text-gray-400")}>Likes</span>
        </Button>
        <Button
          className={`flex flex-1 items-center justify-center gap-1 rounded-md py-2 px-6 text-gray-600 hover:bg-[#edf1f5]`}
          aria-label="Leave a Comment"
        >
          <BiMessageDots aria-hidden="true" size={20} />
          <span className="text-xs text-gray-600">Comment</span>
        </Button>
        <Button
          aria-label="Share a post"
          className="flex flex-1 items-center justify-center gap-1 rounded-md py-2 px-6 text-gray-600 hover:bg-[#edf1f5]"
        >
          <FaShare aria-hidden="true" size={20} />
          <span className="text-xs text-gray-600">Share</span>
        </Button>
      </div>
    </div>
  );
};

export default PostItem;
