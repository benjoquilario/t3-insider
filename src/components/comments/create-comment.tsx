"use client"

import React from "react"
import CommentItem from "./comment-item"
import CommentForm from "./comment-form"
import { QUERY_KEYS } from "@/lib/queriesKey"
import { useInfiniteQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import type { User } from "@prisma/client"
import { ImSpinner8 } from "react-icons/im"
import { Button } from "@/components/ui/button"

type CreateCommentProps = {
  postId: string
}

const CreateComment = (props: CreateCommentProps) => {
  const { postId } = props

  const {
    data: comments,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_COMMENTS, postId],
    queryFn: ({ pageParam }) =>
      fetch(`/api/comments/${postId}?limit=${3}&cursor=${pageParam}`).then(
        (res) => res.json()
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
    refetchOnWindowFocus: false,
  })

  return isPending ? (
    <div className="flex animate-spin items-center justify-center py-4">
      <ImSpinner8 className="size-6" />
    </div>
  ) : (
    <div className="pb-4" id="comment">
      <ul>
        {comments?.pages.map((page) =>
          page?.comments.map((comment: IComment<User>) => (
            <motion.li
              key={comment.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CommentItem comment={comment} postId={postId} />
            </motion.li>
          ))
        )}
        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-4">
            <ImSpinner8 className="animate-spin text-2xl text-foreground" />
          </div>
        )}
        {!isFetchingNextPage && hasNextPage && (
          <li className="ml-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => fetchNextPage()}
              className="underline-offset-1 hover:underline"
            >
              View more comments
            </Button>
          </li>
        )}
      </ul>
      <div className="px-3 pt-4 md:px-5">
        <CommentForm postId={postId} commentId="" />
      </div>
    </div>
  )
}

export default CreateComment
