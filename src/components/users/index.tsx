import React, { useState, useRef, useCallback } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { BiWorld, BiBookmark } from "react-icons/bi";
import { BsFillBellFill } from "react-icons/bs";
import User from "./user";
import { trpc } from "@/utils/trpc";
import Image from "../shared/image";
import UsersSkeleton from "../skeleton/users-skeleton";
import Dropdown from "./dropdown";
import useClickOutside from "hooks/useClickOutside";
import ButtonTooltip from "../shared/button-tooltip";
import Button from "../shared/button";
import { useRouter } from "next/router";

const Users = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const { data: authUser, isLoading: isAuthLoading } =
    trpc.user.authUser.useQuery();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  } = trpc.user.getUsers.useInfiniteQuery(
    { limit: 3 },
    {
      getNextPageParam: (lastPage) => lastPage.nextSkip,
      refetchOnWindowFocus: false,
    }
  );

  useClickOutside(ref, (e) => {
    if (e.target !== buttonRef.current) {
      setIsOpen(false);
    }
  });

  return (
    <div className="sticky top-0">
      <div className="relative flex items-center justify-end gap-2">
        <ul className="flex gap-2">
          {/* {isError && <div>{error.message}</div>} */}
          <li className="flex w-full items-center rounded-full bg-white shadow hover:bg-zinc-200">
            <ButtonTooltip
              tooltip={<p>Bookmark</p>}
              onClick={() => router.push("/community")}
              className="flex w-full items-center rounded-lg px-3 py-3"
            >
              <span className="text-lg text-zinc-800">
                <BiBookmark />
              </span>
            </ButtonTooltip>
          </li>
          <li className=" flex w-full items-center rounded-full bg-white shadow hover:bg-zinc-200">
            <ButtonTooltip
              tooltip={<p>Notification</p>}
              onClick={() => setIsNotificationOpen((prev) => !prev)}
              className="flex w-full items-center rounded-lg px-3 py-3"
            >
              <span className="text-lg text-zinc-800">
                <BsFillBellFill />
              </span>
            </ButtonTooltip>
          </li>
        </ul>
        <div ref={buttonRef} className="flex items-center justify-end">
          <div className="flex items-center justify-center gap-1">
            {isAuthLoading ? (
              <div className="h-12 w-12 animate-pulse rounded-full border border-zinc-200 bg-zinc-100" />
            ) : (
              <Button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-14 w-16 items-center justify-center rounded-full "
                aria-label="list box"
              >
                <IoMdArrowDropdown size={20} />

                <Image
                  className="rounded-full"
                  src={authUser?.image || "/default-image.png"}
                  alt={authUser?.name || ""}
                  layout="fill"
                  containerclassnames="relative h-12 w-14 rounded-fulf"
                />
              </Button>
            )}
            {isOpen && <Dropdown ref={ref} />}
          </div>
        </div>
      </div>
      <div className="mt-16">
        <aside className="dark:bg-primary-dark-200 rounded-md bg-white shadow">
          <h2 className="font-poppins py-3 px-5   text-sm font-semibold ">
            Trends this week
          </h2>
          <a className="block" href="/tag/trpc">
            <div className=" dark:hover:bg-primary-dark-300 cursor-pointer px-5 py-3 hover:bg-blue-50">
              <p className="text-md mb-2 font-bold ">#trpc</p>
              <p className="dark:text-primary-dark-600 text-xs font-medium text-zinc-400">
                1 posts
              </p>
            </div>
          </a>
        </aside>
        <aside className="mt-2">
          <div className="flex w-full flex-col justify-center rounded-xl border-t border-zinc-200 py-3">
            <p className="text-md text-center font-bold text-zinc-800">
              Who to follow
            </p>

            <ul className="mt-3 max-h-96 w-full space-y-1 overflow-y-auto">
              {isLoading
                ? Array.from(Array(4), (_, i) => <UsersSkeleton key={i} />)
                : data?.pages.map((page) =>
                    page.users.map((user) => <User user={user} key={user.id} />)
                  )}
              {hasNextPage && !isFetchingNextPage && (
                <li className="flex items-center justify-center">
                  <button className="text-zinc-900">Load More</button>
                </li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Users;
