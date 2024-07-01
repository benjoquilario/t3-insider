"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  updateProfilePicture,
  updateCoverPicture,
  updateUserInformation,
} from "@/server/user"
import { useMemo } from "react"
import { useSession } from "next-auth/react"
import { UserSchema } from "@/lib/validations/user"

export function useUpdateDataMutation(userId?: string) {
  const { data: session } = useSession()
  const sessionId = session?.user.id

  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ["users", sessionId], [sessionId])

  const updateProfilePhoto = useMutation({
    mutationFn: ({ url }: { url: string }) => updateProfilePicture({ url }),
    onSuccess: (updatedPhoto) => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ["user", userId] })
    },
  })

  const updateCoverPhoto = useMutation({
    mutationFn: ({ url }: { url: string }) => updateCoverPicture({ url }),
    onSuccess: (updatedPhoto) => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ["user", userId] })
    },
  })

  const updateUserData = useMutation({
    mutationFn: (data: UserSchema) => updateUserInformation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return { updateProfilePhoto, updateCoverPhoto, updateUserData }
}
