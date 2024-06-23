"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { QUERY_KEYS } from "@/lib/queriesKey"
import { likePost, unlikePost, likeComment, unlikeComment } from "@/server/like"
import type { User } from "@prisma/client"
import { useMemo } from "react"

export function useLikeCommentMutation({
  postId,
  commentId,
}: {
  postId: string
  commentId: string
}) {
  const queryClient = useQueryClient()
  const queryKey = useMemo(
    () => [QUERY_KEYS.GET_INFINITE_COMMENTS, postId],
    [postId]
  )

  const likeCommentMutation = useMutation({
    mutationFn: async () => {
      const response = await likeComment({ commentId })

      if (!response?.ok) {
        if (response?.status === 409) return
      }

      return true
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousComment = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<InfiniteData<ICommentPage<IComment<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newComments = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (page) {
                return {
                  ...page,
                  comments: page.comments.map((comment) => {
                    if (comment.id === commentId) {
                      return {
                        ...comment,
                        _count: {
                          ...comment._count,
                          commentLike: comment._count.commentLike + 1,
                        },
                        isLiked: true,
                      }
                    } else {
                      return comment
                    }
                  }),
                }
              }

              return page
            }),
          }

          return newComments
        }
      )

      return { previousComment }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousComment)
    },
  })

  const unlikeCommentMutation = useMutation({
    mutationFn: async () => {
      const response = await unlikeComment({ commentId })

      if (!response?.ok) {
        if (response?.status === 409) return
      }

      return true
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousComment = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<InfiniteData<ICommentPage<IComment<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newComments = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (page) {
                return {
                  ...page,
                  comments: page.comments.map((comment) => {
                    if (comment.id === commentId) {
                      return {
                        ...comment,
                        _count: {
                          ...comment._count,
                          commentLike: comment._count.commentLike - 1,
                        },
                        isLiked: false,
                      }
                    } else {
                      return comment
                    }
                  }),
                }
              }

              return page
            }),
          }

          return newComments
        }
      )

      return { previousComment }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { likeCommentMutation, unlikeCommentMutation }
}
