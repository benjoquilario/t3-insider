"use client"

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/queriesKey"
import { createComment } from "@/server/comment"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@prisma/client"
import { useMemo } from "react"

export function useCreateCommentMutation({ postId }: { postId: string }) {
  const queryKey = useMemo(
    () => [QUERY_KEYS.GET_INFINITE_COMMENTS, postId],
    [postId]
  )
  const queryClient = useQueryClient()

  const createCommentMutation = useMutation({
    mutationFn: (comment: ICreateComment) =>
      createComment({
        postId: comment.postId,
        commentText: comment.commentText,
      }),
    onSuccess: (newComment) => {
      queryClient.setQueryData<InfiniteData<ICommentPage<IComment<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newComments = {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  comments: [
                    newComment.data,
                    ...(page.comments ? page.comments : new Array()),
                  ],
                }
              }

              return page
            }),
          }

          return newComments
        }
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { createCommentMutation }
}
