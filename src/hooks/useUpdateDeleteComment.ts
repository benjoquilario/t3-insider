"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/queriesKey"
import { updatePost, deletePost } from "@/server/post"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@prisma/client"
import { useMemo } from "react"
import { updateComment, deleteComment } from "@/server/comment"

export function useUpdateDeleteMutation({ postId }: { postId: string }) {
  const queryClient = useQueryClient()
  const queryKey = useMemo(
    () => [QUERY_KEYS.GET_INFINITE_COMMENTS, postId],
    [postId]
  )
  const { toast } = useToast()

  const updateCommentMutation = useMutation({
    mutationFn: ({
      comment,
      commentId,
    }: {
      comment: string
      commentId: string
    }) => updateComment({ commentId, comment }),
    onMutate: async (updatedComment) => {
      queryClient.setQueryData<InfiniteData<ICommentPage<IComment<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const updatedPosts = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              const index = page.comments?.findIndex(
                (oldPost) => oldPost.id === updatedComment.commentId
              )

              const newComments = [...page.comments]

              newComments[index] = {
                ...page.comments[index],
                updatedAt: new Date(),
                comment: updatedComment.commentId,
              }

              return {
                ...page,
                posts: newComments,
              }
            }),
          }

          return updatedPosts
        }
      )
    },
    onSuccess: () => {
      toast({
        title: "Post successfully updated",
      })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const deleteCommentMutation = useMutation({
    mutationFn: ({ commentId }: { commentId: string }) =>
      deleteComment({ commentId }),
    // onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onMutate: async (deletedPost) => {
      await queryClient.cancelQueries({ queryKey })

      const previousComment = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<InfiniteData<ICommentPage<IComment<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newPosts = {
            ...oldData,
            pages: oldData.pages.map((page, i) => {
              const deletedComments = page.comments.filter(
                (post) => post.id !== deletedPost.commentId
              )

              return {
                ...page,
                posts: deletedComments,
              }
            }),
          }

          return newPosts
        }
      )

      return { previousComment }
    },
  })

  return { updateCommentMutation, deleteCommentMutation }
}
