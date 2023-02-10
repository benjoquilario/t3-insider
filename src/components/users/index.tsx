import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { BiWorld, BiBookmark } from "react-icons/bi";
import { BsFillBellFill } from "react-icons/bs";
import User from "./user";
import { trpc } from "@/utils/trpc";
import Image from "../shared/image";

const Users = () => {
  const { data: authUser } = trpc.user.authUser.useQuery();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = trpc.user.getUsers.useInfiniteQuery(
    { limit: 3 },
    {
      getNextPageParam: (lastPage) => lastPage.nextSkip,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="sticky top-0">
      <div className="flex items-center justify-end gap-2">
        <ul className="flex gap-2">
          <li className="flex w-full items-center rounded-full bg-white shadow hover:bg-zinc-200">
            <a
              className="flex w-full items-center rounded-lg px-3 py-3"
              href="/community"
            >
              <span className="text-lg text-gray-800">
                <BiBookmark />
              </span>
            </a>
          </li>
          <li className=" flex w-full items-center rounded-full bg-white shadow hover:bg-zinc-200">
            <a
              className="flex w-full items-center rounded-lg px-3 py-3"
              href="/community"
            >
              <span className="text-lg text-gray-800">
                <BsFillBellFill />
              </span>
            </a>
          </li>
        </ul>
        <div className="relative flex items-center justify-end">
          <div className="flex items-center justify-center gap-1">
            <button
              className="flex h-14 w-16 items-center justify-center rounded-full "
              aria-label="list box"
            >
              <IoMdArrowDropdown size={20} />
              <Image
                className="rounded-full"
                src={authUser?.image || "/default-image.png"}
                alt={authUser?.name || ""}
                layout="fill"
                containerclassnames="relative h-12 w-14 rounded-md rounded-ful "
              />
            </button>
            {/* {dropdown && <Dropdown user={user} logout={logout} />} */}
            <div></div>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <aside className="dark:bg-primary-dark-200 rounded-md border border-gray-200  bg-white">
          <h2 className="font-poppins py-3 px-5   text-sm font-semibold ">
            Trends this week
          </h2>
          <a className="block" href="/tag/trpc">
            <div className=" dark:hover:bg-primary-dark-300 cursor-pointer px-5 py-3 hover:bg-blue-50">
              <p className="text-md mb-2 font-bold ">#trpc</p>
              <p className="dark:text-primary-dark-600 text-xs font-medium text-gray-400">
                1 posts
              </p>
            </div>
          </a>
        </aside>
        <aside className="mt-2">
          <div className="flex w-full flex-col justify-center rounded-xl border-t border-gray-200 py-3">
            <p className="text-md text-center font-bold text-gray-800">
              Who to follow
            </p>

            <ul className="mt-3 max-h-96 w-full space-y-1 overflow-y-auto">
              {data?.pages.map((page) =>
                page.users.map((user) => <User user={user} key={user.id} />)
              )}

              <li className="flex items-center justify-center">
                <button className="text-white">Load More</button>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Users;
