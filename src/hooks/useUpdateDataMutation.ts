"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfilePicture, updateCoverPicture } from "@/server/user"
import { useMemo } from "react"
import type { User } from "@prisma/client"

export function useUpdateDataMutation({ userId }: { userId?: string }) {
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ["users", userId], [userId])

  const updateProfilePhoto = useMutation({
    mutationFn: ({ url }: { url: string }) => updateProfilePicture({ url }),
    onSuccess: (updatedPhoto) => {
      queryClient.setQueryData<User>(queryKey, (oldData) => {
        if (!oldData) return

        return {
          ...oldData,
          url: updatedPhoto?.url,
        }
      })
    },
  })

  const updateCoverPhoto = useMutation({
    mutationFn: ({ url }: { url: string }) => updateCoverPicture({ url }),
    onSuccess: (updatedPhoto) => {
      queryClient.setQueryData<User>(queryKey, (oldData) => {
        if (!oldData) return

        return {
          ...oldData,
          cover: updatedPhoto?.url!,
        }
      })
    },
  })

  return { updateProfilePhoto, updateCoverPhoto }
}
