"use client"

import React from "react"
import CommentItem from "./comment-item"
import CommentForm from "./comment-form"
import { QUERY_KEYS } from "@/lib/queriesKey"
import { useInfiniteQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import type { User } from "@prisma/client"
import { ImSpinner8 } from "react-icons/im"

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
      <ImSpinner8 className="h-6 w-6" />
    </div>
  ) : (
    <div className="pb-4" id="comment">
      <div className="px-3 pt-4 md:px-5">
        <CommentForm postId={postId} commentId="" />
      </div>
      <ul>
        {comments?.pages.map((page) =>
          page?.comments.map((comment: IComment<User>) => (
            <motion.li
              key={comment.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CommentItem comment={comment} />
            </motion.li>
          ))
        )}
      </ul>
    </div>
  )
}

export default CreateComment
