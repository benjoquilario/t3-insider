"use client"

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/queriesKey"
import { createReplyComment } from "@/server/reply"
import type { User } from "@prisma/client"
import { useMemo } from "react"

export function useCreateReplyCommentMutation({
  commentId,
}: {
  commentId: string
}) {
  const queryKey = useMemo(
    () => [QUERY_KEYS.GET_INFINITE_REPLY_COMMENTS, commentId],
    [commentId]
  )
  const queryClient = useQueryClient()

  const createReplyCommentMutation = useMutation({
    mutationFn: (comment: { content: string; commentId: string }) =>
      createReplyComment({
        commentId: comment.commentId,
        content: comment.content,
      }),
    onSuccess: (newComment) => {
      queryClient.setQueryData<InfiniteData<IReplyPage<IReplyComment<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newReplyComments = {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  replies: [
                    newComment.data,
                    ...(page.replies ? page.replies : new Array()),
                  ],
                }
              }

              return page
            }),
          }

          return newReplyComments
        }
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { createReplyCommentMutation }
}
