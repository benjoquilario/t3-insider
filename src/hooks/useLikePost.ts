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

export function useLikePostMutation({
  postId,
  userId,
  content,
}: {
  postId: string
  userId?: string
  content: string
}) {
  const queryClient = useQueryClient()
  const queryKey = [QUERY_KEYS.GET_INFINITE_POSTS]

  const likePostMutation = useMutation({
    mutationFn: () => likePost({ postId, content }),
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

      queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
        [QUERY_KEYS.GET_INFINITE_POSTS, userId],
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
    mutationFn: () => unlikePost({ postId }),
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

      if (userId) {
        queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
          [QUERY_KEYS.GET_INFINITE_POSTS, userId],
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
      }

      return { previousPost }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { likePostMutation, unlikePostMutation }
}
