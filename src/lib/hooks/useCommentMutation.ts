import { trpc } from "@/lib/utils/trpc"

export const useMutateCreateComment = () => {
  const utils = trpc.useContext()

  const onSuccess = async () => {
    await utils.comment.getComments.invalidate()
    await utils.post.getPosts.invalidate()
  }

  const { mutateAsync: mutateAsyncCreate } =
    trpc.comment.createComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await onSuccess()
      },
    })

  return mutateAsyncCreate
}

export const useMutateUpdateComment = () => {
  const utils = trpc.useContext()

  const onSuccess = async () => {
    await utils.comment.getComments.invalidate()
    await utils.post.getPosts.invalidate()
  }

  const { mutateAsync: mutateAsyncUpdate } =
    trpc.comment.updateComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await onSuccess()
      },
    })

  return mutateAsyncUpdate
}

/** ReplyComment Mutation */

export const useMutateCreateReply = (commentId: string) => {
  const utils = trpc.useContext()

  const onSuccess = async () => {
    await utils.comment.getReplyComments.invalidate({
      limit: 3,
      commentId,
    })
  }

  const { mutateAsync: mutateAsyncCreate } =
    trpc.comment.replyComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await onSuccess()
      },
    })

  return mutateAsyncCreate
}

export const useMutateUpdateReply = (commentId: string) => {
  const utils = trpc.useContext()

  const onSuccess = async () => {
    await utils.comment.getReplyComments.invalidate({
      limit: 3,
      commentId,
    })
  }

  const { mutateAsync: mutateAsyncUpdate } =
    trpc.comment.updateReplyComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await onSuccess()
      },
    })

  return mutateAsyncUpdate
}
