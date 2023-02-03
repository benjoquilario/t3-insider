import React from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import { useSession } from "next-auth/react";
import Button from "../shared/button";
import usePostStore from "@/store/post";

const CreateButton = () => {
  const session = useSession();
  const setPostOpen = usePostStore((store) => store.setPostOpen);
  const setIsEditing = usePostStore((store) => store.setIsEditing);
  const setCurrentPostId = usePostStore((store) => store.setCurrentPostId);

  const handlePostOpen = () => {
    setPostOpen(true);
    setIsEditing(false);
    setCurrentPostId("");
  };

  return (
    <div className="relative my-2 flex h-20 items-center justify-start gap-2 overflow-hidden rounded border border-gray-200 bg-white p-2 px-1 md:px-3">
      <div className="min-h-6 max-w-20 w-12">
        <Link href={`profile/${session.data?.user?.id as string}`} tabIndex={0}>
          <div className="relative h-11 w-11 overflow-hidden before:absolute before:top-0 before:left-0 before:-z-10 before:h-full before:w-full before:rounded-full before:bg-gray-900">
            <Image
              className="m-auto rounded-full"
              src="/default-image.png"
              alt="avatar"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </Link>
      </div>
      <Button
        className="mr-1 flex h-11 w-full items-center justify-start rounded-full bg-zinc-50 p-3 text-gray-400 shadow hover:bg-zinc-100"
        aria-label="create a post"
        onClick={handlePostOpen}
      >
        <span className="ml-2 text-xs md:text-sm">
          What&apos;s on your mind,
        </span>
      </Button>
    </div>
  );
};

export default CreateButton;
