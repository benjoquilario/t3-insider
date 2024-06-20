"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { QUERY_KEYS } from "@/lib/queriesKey"
import { likePost, unlikePost } from "@/server/like"
import type { User } from "@prisma/client"

export function useLikePostMutation({ postId }: { postId: string }) {
  const queryClient = useQueryClient()
  const queryKey = [QUERY_KEYS.GET_INFINITE_POSTS]

  const likePostMutation = useMutation({
    mutationFn: async () => {
      const response = await likePost({ postId })

      if (!response?.ok) {
        if (response?.status === 409) return
      }

      return true
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousPost = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newPosts = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (page) {
                return {
                  ...page,
                  posts: page.posts.map((post) => {
                    if (post.id === postId) {
                      return {
                        ...post,
                        _count: {
                          ...post._count,
                          likePost: post._count.likePost + 1,
                        },
                        isLiked: true,
                      }
                    } else {
                      return post
                    }
                  }),
                }
              }

              return page
            }),
          }

          return newPosts
        }
      )

      return { previousPost }
    },
  })

  const unlikePostMutation = useMutation({
    mutationFn: async () => {
      const response = await unlikePost({ postId })

      if (!response?.ok) {
        if (response?.status === 409) return
      }

      return true
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousPost = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newPosts = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (page) {
                return {
                  ...page,
                  posts: page.posts.map((post) => {
                    if (post.id === postId) {
                      return {
                        ...post,
                        _count: {
                          ...post._count,
                          likePost: post._count.likePost - 1,
                        },
                        isLiked: false,
                      }
                    } else {
                      return post
                    }
                  }),
                }
              }

              return page
            }),
          }

          return newPosts
        }
      )

      return { previousPost }
    },
  })

  return { likePostMutation, unlikePostMutation }
}
