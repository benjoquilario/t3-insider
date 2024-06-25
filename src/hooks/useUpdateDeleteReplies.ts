"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/queriesKey"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@prisma/client"
import { useMemo } from "react"
import { updateReplyComment, deleteReplyComment } from "@/server/reply"

export function useUpdateDeleteRepliesMutation({
  commentId,
}: {
  commentId: string
}) {
  const queryClient = useQueryClient()
  const queryKey = useMemo(
    () => [QUERY_KEYS.GET_INFINITE_REPLY_COMMENTS, commentId],
    [commentId]
  )
  const { toast } = useToast()

  const updateReplyMutation = useMutation({
    mutationFn: ({ content, replyId }: { content: string; replyId: string }) =>
      updateReplyComment({ replyId, content }),
    onMutate: async (updatedComment) => {
      queryClient.setQueryData<InfiniteData<IReplyPage<IReplyComment<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const updatedReplies = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              const index = page.replies?.findIndex(
                (oldPost) => oldPost.id === updatedComment.replyId
              )

              const newReplies = [...page.replies]

              newReplies[index] = {
                ...page.replies[index],
                content: updatedComment.content,
                isEdited: true,
              }

              return {
                ...page,
                replies: newReplies,
              }
            }),
          }

          return updatedReplies
        }
      )
    },
    onSuccess: () => {
      toast({
        title: "Reply successfully updated",
      })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const deleteReplyMutation = useMutation({
    mutationFn: ({ replyId }: { replyId: string }) =>
      deleteReplyComment({ replyId }),
    // onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onMutate: async (deletedPost) => {
      await queryClient.cancelQueries({ queryKey })

      const previousComment = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<InfiniteData<IReplyPage<IReplyComment<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newReplies = {
            ...oldData,
            pages: oldData.pages.map((page, i) => {
              const deletedComments = page.replies.filter(
                (reply) => reply.id !== deletedPost.replyId
              )

              return {
                ...page,
                replies: deletedComments,
              }
            }),
          }

          return newReplies
        }
      )

      return { previousComment }
    },
    onSuccess: () => {
      toast({
        title: "Reply successfully deleted",
      })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { updateReplyMutation, deleteReplyMutation }
}
