import { trpc } from "@/utils/trpc";
import PostItem from "./post-item";

import React, { useEffect } from "react";
import PostForm from "../form/post";

type PostsProps = {
  type: "getFollowingPosts" | "getPosts" | string;
};

const Posts: React.FC<PostsProps> = ({ type }) => {
  // const {
  //   data,
  //   isLoading,
  //   refetch,
  //   isFetchingNextPage,
  //   hasNextPage,
  //   fetchNextPage,
  //   isError,
  // } = trpc.post.getPosts.useInfiniteQuery(
  //   { limit: 3 },
  //   {
  //     getNextPageParams: (lastPage) => lastPage.nextSkip,
  //     refetchOnWindowFocus: false,
  //   }
  // );
  // const [posts, setPosts] = useState([]);
  const { data, isLoading, refetch } = trpc.post.getPosts.useQuery({
    limit: 3,
  });

  return (
    <React.Fragment>
      {isLoading ? (
        <div>loading...</div>
      ) : (
        data?.posts.map((post) => <PostItem post={post} key={post.id} />)
      )}
      <PostForm refetch={refetch} />
    </React.Fragment>
  );
};

export default Posts;
