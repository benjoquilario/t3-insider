import { trpc } from "@/utils/trpc";
import PostItem from "./post-item";
import dynamic from "next/dynamic";
import React from "react";
import type { Post as PostType, User } from "@/types/types";
import usePostStore from "@/store/post";
import { InView } from "react-intersection-observer";
import { ToastContainer } from "react-toastify";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import ModalDelete from "../modal/modal-delete";
import useCommentStore from "@/store/comment";

const CreateForm = dynamic(() => import("@/components/form/post"), {
  ssr: false,
});

type PostsProps = {
  type: "getFollowingPosts" | "getPosts" | string;
};

const Posts: React.FC<PostsProps> = ({ type }) => {
  const utils = trpc.useContext();
  const { data: session } = useSession();
  const postOpen = usePostStore((store) => store.postOpen);
  const [isModalDeletePostOpen, setIsModalDeletePostOpen] = usePostStore(
    (store) => [store.isModalDeletePostOpen, store.setIsModalDeletePostOpen]
  );
  const currentPostId = usePostStore((store) => store.currentPostId);
  const commentId = useCommentStore((store) => store.commentId);
  const [isCommentModalOpen, setIsCommentModalOpen] = useCommentStore(
    (store) => [store.isCommentModalOpen, store.setIsCommentModalOpen]
  );

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

  const { mutate: mutateDeletePost, isLoading: isDeleteLoading } =
    trpc.post.deletePost.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await utils.post.getPosts.invalidate();
        await utils.post.getPostsById.invalidate({
          id: session?.user?.id,
          limit: 3,
        });
        toast("Your post was deleted successfully", {
          type: "success",
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      },
    });

  const { mutate: mutateDeleteComment } =
    trpc.comment.deleteComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await utils.comment.getComments.invalidate();
      },
    });

  const handleDeletePost = () => {
    mutateDeletePost({ id: currentPostId });
    setIsModalDeletePostOpen(false);
  };

  const handleDeleteComment = () => {
    mutateDeleteComment({ id: commentId });
    setIsCommentModalOpen(false);
  };

  return (
    <React.Fragment>
      <ul>
        {isLoading ? (
          <li>loading...</li>
        ) : (
          data?.pages.map((page) =>
            page.posts.map((post) => (
              <PostItem post={post as PostType<User>} key={post.id} />
            ))
          )
        )}
        {isModalDeletePostOpen && (
          <ModalDelete
            type="Post"
            handleDelete={handleDeletePost}
            isModalOpen={isModalDeletePostOpen}
            setIsModalOpen={setIsModalDeletePostOpen}
          />
        )}
        {isCommentModalOpen && (
          <ModalDelete
            type="Comment"
            handleDelete={handleDeleteComment}
            isModalOpen={isCommentModalOpen}
            setIsModalOpen={setIsCommentModalOpen}
          />
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
      </ul>
      <ToastContainer />
    </React.Fragment>
  );
};

export default Posts;
