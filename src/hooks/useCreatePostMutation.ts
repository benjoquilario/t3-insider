"use client"

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/queriesKey"
import { createPost } from "@/server/post"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@prisma/client"

export function useCreatePostMutation(handleOnCallback: () => void) {
  const queryClient = useQueryClient()
  const queryKey = [QUERY_KEYS.GET_INFINITE_POSTS]
  const { toast } = useToast()

  const createPostMutation = useMutation({
    mutationFn: (post: ICreatePost) => createPost(post),
    // mutationKey: ["createComment"],
    onSuccess: (newPost) => {
      queryClient.setQueryData<InfiniteData<IPage<IPost<User>[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newPosts = {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  posts: [
                    newPost?.data,
                    ...(page.posts ? page.posts : new Array()),
                  ],
                }
              }

              return page
            }),
          }

          return newPosts
        }
      )

      toast({
        title: "Successfully Posted",
      })
      handleOnCallback()
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { createPostMutation }
}
