import { trpc } from "../utils/trpc"

export const useMutateDeletePost = (callback: () => void, userId?: string) => {
  const utils = trpc.useContext()
  const { mutate: mutateDeletePost } = trpc.post.deletePost.useMutation({
    onError: (e) => console.log(e.message),
    onSuccess: () => {
      utils.post.getPosts.invalidate()
      utils.post.getPostsById.invalidate({
        id: userId,
        limit: 3,
      })
      callback()
    },
  })

  return mutateDeletePost
}

export const useMutateDeleteComment = () => {
  const utils = trpc.useContext()
  const { mutate: mutateDeleteComment } =
    trpc.comment.deleteComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: () => {
        utils.comment.getComments.invalidate()
      },
    })

  return mutateDeleteComment
}
