import { trpc } from "@/lib/utils/trpc"

export const useMutateCreatePost = (callback: () => void, userId?: string) => {
  const utils = trpc.useContext()

  const { mutateAsync: mutateCreatePost, isLoading: isCreatePostLoading } =
    trpc.post.createPost.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        callback()
        await utils.post.getPosts.invalidate()
        await utils.post.getPostsById.invalidate({
          id: userId,
          limit: 3,
        })
      },
    })

  return { mutateCreatePost, isCreatePostLoading }
}

export const useMutateUpdatePost = (callback: () => void) => {
  const utils = trpc.useContext()
  const { mutateAsync: mutateUpdatePost, isLoading: isUpdateLoading } =
    trpc.post.updatePost.useMutation({
      onError: (e) => {
        console.log(e.message)
      },
      onSuccess: async () => {
        callback()
        await utils.post.getPosts.invalidate()
      },
    })

  return { mutateUpdatePost, isUpdateLoading }
}

export const useMutateDeleteImages = (userId?: string) => {
  const utils = trpc.useContext()

  const { mutate: mutateDeleteImage } = trpc.post.deleteImage.useMutation({
    onSuccess: async () => {
      await utils.post.getPosts.invalidate()
      await utils.post.getPostsById.invalidate({
        id: userId,
        limit: 3,
      })
    },
  })

  return mutateDeleteImage
}
