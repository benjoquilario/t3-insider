"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/queriesKey"
import type { User } from "@prisma/client"
import { follow, unFollow } from "@/server/follow"
import { useMemo } from "react"

interface IUser extends User {
  isFollowing: boolean
  followerCount: number
  followingCount: number
}

export function useFolloMutation({
  userIdToFollow,
}: {
  userIdToFollow: string
}) {
  const queryClient = useQueryClient()
  const userKey = useMemo(() => ["user", userIdToFollow], [userIdToFollow])
  const postsKey = [QUERY_KEYS.GET_INFINITE_POSTS]

  const followMutation = useMutation({
    mutationFn: () => follow({ userIdToFollow }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: userKey })
      await queryClient.cancelQueries({ queryKey: postsKey })

      const previousTargetUser = queryClient.getQueryData(userKey)

      const previousTargetPost = queryClient.getQueryData(postsKey)

      queryClient.setQueryData<IUser>(userKey, (oldData) => {
        if (!oldData) return

        return {
          ...oldData,
          isFollowing: true,
          followerCount: (oldData.followerCount || 0) + 1,
        }
      })

      queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
        postsKey,
        (oldData) => {
          if (!oldData) return

          const newPosts = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (page) {
                return {
                  ...page,
                  posts: page.posts.map((post) => {
                    if (post.user.id === userIdToFollow) {
                      return {
                        ...post,
                        isFollowing: true,
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

      return { previousTargetUser, previousTargetPost }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(userKey, context?.previousTargetUser)
      queryClient.setQueryData(postsKey, context?.previousTargetPost)
    },
  })

  const unFollowMutation = useMutation({
    mutationFn: () => unFollow({ userIdToFollow }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: userKey })

      const previousTargetUser = queryClient.getQueryData(userKey)
      const previousTargetPost = queryClient.getQueryData(postsKey)

      queryClient.setQueryData<IUser>(userKey, (oldData) => {
        if (!oldData) return

        return {
          ...oldData,
          isFollowing: false,
          followerCount: (oldData.followerCount || 0) - 1,
        }
      })

      queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
        postsKey,
        (oldData) => {
          if (!oldData) return

          const newPosts = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (page) {
                return {
                  ...page,
                  posts: page.posts.map((post) => {
                    if (post.user.id === userIdToFollow) {
                      return {
                        ...post,
                        isFollowing: false,
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

      return { previousTargetUser, previousTargetPost }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(userKey, context?.previousTargetUser)
      queryClient.setQueryData(postsKey, context?.previousTargetPost)
    },
  })

  return { followMutation, unFollowMutation }
}
