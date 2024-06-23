"use client"

import React from "react"
import Layout from "@/components/layout"
import Section from "@/components/section"
import { cn } from "@/lib/utils"
import { AiFillCheckCircle } from "react-icons/ai"
import ProfilePhoto from "@/components/profile/profile-photo"
import CoverPhoto from "@/components/profile/cover-photo"
import { useSession } from "next-auth/react"
import { useQueryUser } from "@/hooks/queries/useQueryUser"
import PostSkeleton from "@/components/skeleton/post-skeleton"
import { InView } from "react-intersection-observer"
import { motion, AnimatePresence } from "framer-motion"
import { QUERY_KEYS } from "@/lib/queriesKey"
import { useInfiniteQuery } from "@tanstack/react-query"
import PostItem from "@/components/posts/post-item"
import type { User } from "@prisma/client"
import ProfileSkeleton from "@/components/skeleton/profile-skeleton"
import CreateButton from "@/components/posts/create-buttons"

const Profile = ({ params }: { params: { userId: string } }) => {
  const userId = params.userId
  const { data: session } = useSession()
  const { data: currentUser, isPending: isUserLoading } = useQueryUser(
    session?.user.id
  )

  const {
    data: posts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS, userId],
    queryFn: ({ pageParam }) =>
      fetch(`/api/posts/${userId}?limit=${3}&cursor=${pageParam}`).then((res) =>
        res.json()
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
    refetchOnWindowFocus: false,
  })

  return (
    <Layout>
      <Section>
        <div className="col-span-full lg:col-span-9 xl:col-span-6">
          {/*  */}
          {isUserLoading ? (
            <ProfileSkeleton />
          ) : (
            <div className="mb-2 mt-0">
              <CoverPhoto
                photoUrl={currentUser?.cover!}
                userId={session?.user.id}
              />
              <div className="space-y-4">
                <div className="flex flex-col justify-center bg-white shadow md:flex-row md:justify-between">
                  <div className="flex flex-col items-center justify-center gap-3 px-5 pb-2 pt-2 md:flex-row md:pb-5">
                    <ProfilePhoto
                      photoUrl={currentUser?.image!}
                      userId={session?.user.id}
                    />
                    <div className="text-center sm:text-left">
                      <div>
                        <h1 className="text-lg font-semibold capitalize text-black">
                          {currentUser?.name}
                        </h1>
                        <p className="text-sm text-gray-700">
                          {currentUser?.email}
                        </p>
                        <span className="text-sm text-gray-600">
                          12 Followers
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-center p-3">
                    <button
                      // onClick={handleFollowUser}
                      className={cn(
                        "flex h-8 w-28 items-center justify-center gap-2 rounded-full bg-primary text-sm font-light text-white transition duration-100 ease-out",
                        "outline-offset-2 hover:bg-secondary focus:outline-none focus:ring focus:ring-offset-2 active:scale-110 active:bg-primary"
                      )}
                    >
                      {/* {!isFollowLoading ? (
                        user?.followedByMe ? ( */}
                      <React.Fragment>
                        <div className="flex-shrink-0">
                          <AiFillCheckCircle aria-hidden="true" size={15} />
                        </div>
                        <span>Following</span>
                      </React.Fragment>
                      {/* ) : (
                          <React.Fragment>
                            <div className="flex-shrink-0">
                              <BsFillPersonPlusFill
                                aria-hidden="true"
                                size={15}
                              />
                            </div>
                            <span>Follow</span>
                          </React.Fragment>
                        )
                      ) */}
                    </button>
                    {/* )} */}
                  </div>
                </div>
              </div>
            </div>
          )}
          {userId === session?.user.id && <CreateButton />}
          <ul className="space-y-3">
            <AnimatePresence>
              {isPending
                ? Array.from(Array(2), (_, i) => <PostSkeleton key={i} />)
                : posts?.pages.map((page) =>
                    page?.posts.map((post: IPost<User>) => (
                      <motion.li
                        key={post.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 flex flex-col gap-1 overflow-hidden rounded-md shadow"
                      >
                        <PostItem key={post.id} post={post} userId={userId} />
                      </motion.li>
                    ))
                  )}
              <InView
                fallbackInView
                onChange={async (InView) => {
                  if (InView && hasNextPage && !isFetchingNextPage) {
                    await fetchNextPage()
                  }
                }}
              >
                {({ ref }) => (
                  <li ref={ref} className="mt-4 w-full">
                    {isFetchingNextPage &&
                      Array.from(Array(2), (_, i) => <PostSkeleton key={i} />)}
                  </li>
                )}
              </InView>
            </AnimatePresence>
          </ul>
        </div>
      </Section>
    </Layout>
  )
}

export default Profile
