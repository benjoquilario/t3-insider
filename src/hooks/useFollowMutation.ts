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
  const queryKey = useMemo(() => ["user", userIdToFollow], [userIdToFollow])

  const followMutation = useMutation({
    mutationFn: () => follow({ userIdToFollow }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousTargetUser = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<IUser>(queryKey, (oldData) => {
        if (!oldData) return

        return {
          ...oldData,
          isFollowing: true,
          followerCount: (oldData.followerCount || 0) + 1,
        }
      })

      return { previousTargetUser }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousTargetUser)
    },
  })

  const unFollowMutation = useMutation({
    mutationFn: () => unFollow({ userIdToFollow }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousTargetUser = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<IUser>(queryKey, (oldData) => {
        if (!oldData) return

        return {
          ...oldData,
          isFollowing: false,
          followerCount: (oldData.followerCount || 0) - 1,
        }
      })

      return { previousTargetUser }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousTargetUser)
    },
  })

  return { followMutation, unFollowMutation }
}
