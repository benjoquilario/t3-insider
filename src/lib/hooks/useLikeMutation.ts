import { trpc } from "@/lib/utils/trpc";

export const useMutateLikeComment = (postId: string) => {
  const utils = trpc.useContext();
  const { mutate: mutateLikeComment, isLoading: isLikeLoading } =
    trpc.like.likeComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await utils.comment.getComments.invalidate({
          postId,
          limit: 3,
        });
      },
    });

  return { mutateLikeComment, isLikeLoading };
};

export const useMutationLikeReply = (commentId: string) => {
  const utils = trpc.useContext();
  const { mutate: mutateLikeReplyComent, isLoading: isLikeLoading } =
    trpc.like.likeReplyComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await utils.comment.getReplyComments.invalidate({
          limit: 3,
          commentId,
        });
      },
    });

  return { mutateLikeReplyComent, isLikeLoading };
};
