import { trpc } from "@/lib/utils/trpc"

export const useMutateCreateComment = () => {
  const utils = trpc.useContext()

  const onSuccess = async () => {
    utils.comment.getComments.invalidate()
    utils.post.getPosts.invalidate()
  }

  const { mutateAsync: mutateAsyncCreate } =
    trpc.comment.createComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: () => {
        utils.comment.getComments.invalidate()
        utils.post.getPosts.invalidate()
      },
    })

  return mutateAsyncCreate
}

export const useMutateUpdateComment = () => {
  const utils = trpc.useContext()

  const { mutateAsync: mutateAsyncUpdate } =
    trpc.comment.updateComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        utils.comment.getComments.invalidate()
        utils.post.getPosts.invalidate()
      },
    })

  return mutateAsyncUpdate
}

/** ReplyComment Mutation */

export const useMutateCreateReply = (commentId: string) => {
  const utils = trpc.useContext()

  const onSuccess = () => {
    utils.comment.getReplyComments.invalidate({
      limit: 3,
      commentId,
    })
  }

  const { mutateAsync: mutateAsyncCreate } =
    trpc.comment.replyComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: () => {
        onSuccess()
      },
    })

  return mutateAsyncCreate
}

export const useMutateUpdateReply = (commentId: string) => {
  const utils = trpc.useContext()

  const onSuccess = () => {
    utils.comment.getReplyComments.invalidate({
      limit: 3,
      commentId,
    })
  }

  const { mutateAsync: mutateAsyncUpdate } =
    trpc.comment.updateReplyComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        onSuccess()
      },
    })

  return mutateAsyncUpdate
}
