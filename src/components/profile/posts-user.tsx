"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import React from "react"
import { QUERY_KEYS } from "@/lib/queriesKey"
import { InView } from "react-intersection-observer"
import { AnimatePresence, motion } from "framer-motion"
import { useSession } from "next-auth/react"
import CreateButton from "@/components/posts/create-buttons"
import type { User } from "@prisma/client"
import PostSkeleton from "@/components/skeleton/post-skeleton"
import PostItem from "@/components/posts/post-item"

type PostsUserProps = {
  userId: string
  isUserPost: boolean
}

const PostsUser = (props: PostsUserProps) => {
  const { userId, isUserPost = false } = props
  const { data: session } = useSession()

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

  console.log(posts)

  return (
    <>
      {userId === session?.user.id && <CreateButton userId={userId} />}
      <ul className="space-y-3">
        <AnimatePresence>
          {isPending
            ? Array.from(Array(2), (_, i) => <PostSkeleton key={i} />)
            : posts?.pages.map((page) =>
                page?.posts.length !== 0 ? (
                  page?.posts.map((post: IPost<User>) => (
                    <motion.li
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative z-10 flex flex-col gap-1 overflow-hidden rounded-md shadow"
                    >
                      <PostItem
                        isUserPost={isUserPost}
                        key={post.id}
                        post={post}
                        userId={userId}
                      />
                    </motion.li>
                  ))
                ) : (
                  <motion.li
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-center justify-center text-center text-2xl font-medium"
                  >
                    All Caught up!
                  </motion.li>
                )
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
    </>
  )
}

export default PostsUser
