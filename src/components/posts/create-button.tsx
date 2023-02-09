import React from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import { useSession } from "next-auth/react";
import Button from "../shared/button";
import usePostStore from "@/store/post";
import { trpc } from "@/utils/trpc";

const CreateButton = () => {
  const session = useSession();
  const { data: authUser, isLoading } = trpc.user.authUser.useQuery();
  const setPostOpen = usePostStore((store) => store.setPostOpen);
  const setIsEditing = usePostStore((store) => store.setIsEditing);
  const setCurrentPostId = usePostStore((store) => store.setCurrentPostId);

  const handlePostOpen = () => {
    setPostOpen(true);
    setIsEditing(false);
    setCurrentPostId("");
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <div className="my-2 flex h-20 w-full animate-pulse items-center justify-start gap-2 rounded bg-white px-3 shadow">
          <div className="h-9 w-9 rounded-full bg-zinc-100 shadow md:h-12 md:w-12" />
          <div className="h-9 w-[90%] rounded-full bg-zinc-100 shadow md:h-11 md:w-full"></div>
        </div>
      ) : (
        <div className="relative my-2 flex h-20 items-center justify-start gap-2 overflow-hidden rounded bg-white p-2 shadow ">
          <div className="min-h-6 max-w-20 w-12">
            <Link href={`profile/${session.data?.user?.id as string}`}>
              <div className="relative h-11 w-11 overflow-hidden before:absolute before:top-0 before:left-0 before:-z-10 before:h-full before:w-full before:rounded-full before:bg-gray-900">
                <Image
                  className="m-auto rounded-full"
                  src={authUser?.image || "/default-image.png"}
                  alt={authUser?.name || ""}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </Link>
          </div>
          <Button
            className="mr-1 flex h-11 w-full items-center justify-start rounded-full border border-zinc-200 bg-zinc-100 p-3 text-zinc-400 hover:bg-zinc-200"
            aria-label="create a post"
            onClick={handlePostOpen}
          >
            <span className="ml-2 text-xs md:text-sm">
              What&apos;s on your mind,
            </span>
          </Button>
        </div>
      )}
    </React.Fragment>
  );
};

export default CreateButton;
