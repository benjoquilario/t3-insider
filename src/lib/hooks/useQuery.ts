import { trpc } from "@/lib/utils/trpc";

export const useAuthQuery = () => trpc.user.authUser.useQuery();

export const useInfiniteCommentsQuery = (postId: string) =>
  trpc.comment.getComments.useInfiniteQuery(
    { postId, limit: 3 },
    {
      getNextPageParam: (lastPage) => lastPage.nextSkip,
      refetchOnWindowFocus: false,
    }
  );

export const useInfinitePostsQuery = () =>
  trpc.post.getPosts.useInfiniteQuery(
    { limit: 3 },
    {
      getNextPageParam: (lastPage) => lastPage.nextSkip,
      refetchOnWindowFocus: false,
    }
  );

export const useInfiniteUsersQuery = () =>
  trpc.user.getUsers.useInfiniteQuery(
    { limit: 3 },
    {
      getNextPageParam: (lastPage) => lastPage.nextSkip,
      refetchOnWindowFocus: false,
    }
  );

export const useInfinitePostsByIdQuery = (userId: string) =>
  trpc.post.getPostsById.useInfiniteQuery(
    { id: userId, limit: 3 },
    {
      getNextPageParam: (lastPage) => lastPage.nextSkip,
      refetchOnWindowFocus: false,
    }
  );

export const useUserByIdQuery = (userId: string) =>
  trpc.user.getUserById.useQuery(
    {
      id: userId,
    },
    {
      enabled: !!userId,
    }
  );

export const useInfiniteReplyQuery = (commentId: string) =>
  trpc.comment.getReplyComments.useInfiniteQuery(
    {
      limit: 3,
      commentId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextSkip,
      refetchOnWindowFocus: false,
    }
  );
