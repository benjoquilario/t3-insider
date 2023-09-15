import PostItem from "./post-item"
import dynamic from "next/dynamic"
import React from "react"
import type { Post as PostType, User } from "@/types/types"
import usePostStore from "@/store/post"
import { InView } from "react-intersection-observer"
import { ToastContainer } from "react-toastify"
import Delete from "@/components/delete"
import PostSkeleton from "../skeleton/post-skeleton"
import { useInfinitePostsQuery } from "@/lib/hooks/useQuery"

const CreateForm = dynamic(() => import("@/components/form/post"), {
  ssr: false,
})

const Posts = () => {
  const postOpen = usePostStore((store) => store.postOpen)

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useInfinitePostsQuery()

  return (
    <React.Fragment>
      {isError && <div>Error</div>}
      <Delete />
      {postOpen && <CreateForm />}
      <ul className="space-y-3">
        {isLoading
          ? Array.from(Array(2), (_, i) => <PostSkeleton key={i} />)
          : data?.pages.map((page) =>
              page.posts.map((post) => (
                <PostItem post={post as PostType<User>} key={post.id} />
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
      </ul>
      <ToastContainer />
    </React.Fragment>
  )
}

export default Posts
