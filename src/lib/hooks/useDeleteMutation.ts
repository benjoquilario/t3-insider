import { trpc } from "../utils/trpc";

export const useMutateDeletePost = (callback: () => void, userId?: string) => {
  const utils = trpc.useContext();
  const { mutate: mutateDeletePost, isLoading: isDeleteLoading } =
    trpc.post.deletePost.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await utils.post.getPosts.invalidate();
        await utils.post.getPostsById.invalidate({
          id: userId,
          limit: 3,
        });
        callback();
      },
    });

  return { mutateDeletePost, isDeleteLoading };
};

export const useMutateDeleteComment = () => {
  const utils = trpc.useContext();
  const { mutate: mutateDeleteComment } =
    trpc.comment.deleteComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await utils.comment.getComments.invalidate();
      },
    });

  return mutateDeleteComment;
};
