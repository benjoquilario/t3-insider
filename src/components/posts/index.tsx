/* eslint-disable @typescript-eslint/no-misused-promises */
import { trpc } from "@/utils/trpc";
import PostItem from "./post-item";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo } from "react";
import type { Post as PostType, User } from "@/types/types";
import usePostStore from "@/store/post";
import { InView } from "react-intersection-observer";
import { ToastContainer } from "react-toastify";

const CreateForm = dynamic(() => import("@/components/form/post"), {
  ssr: false,
});

type PostsProps = {
  type: "getFollowingPosts" | "getPosts" | string;
};

const Posts: React.FC<PostsProps> = ({ type }) => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = trpc.post.getPosts.useInfiniteQuery(
    { limit: 3 },
    {
      getNextPageParam: (lastPage) => lastPage.nextSkip,
      refetchOnWindowFocus: false,
    }
  );

  const postOpen = usePostStore((store) => store.postOpen);

  return (
    <React.Fragment>
      {isLoading ? (
        <div>loading...</div>
      ) : (
        data?.pages.map((page) =>
          page.posts.map((post) => (
            <PostItem post={post as PostType<User>} key={post.id} />
          ))
        )
      )}
      {postOpen && <CreateForm />}
      <InView
        fallbackInView
        onChange={async (InView) => {
          if (InView && hasNextPage && !isFetchingNextPage) {
            await fetchNextPage();
          }
        }}
      >
        {({ ref }) => (
          <div ref={ref} className="mt-4 w-full">
            {isFetchingNextPage && <span>Loading...</span>}
          </div>
        )}
      </InView>
      <ToastContainer />
    </React.Fragment>
  );
};

export default Posts;
