"use client"

import React from "react"
import { variants } from "@/lib/variants"
import { motion } from "framer-motion"
import CreateReplyComment from "./create-reply"

type CommentsProps = {
  commentId: string
}

const Replies = (props: CommentsProps) => {
  const { commentId } = props

  return (
    <motion.div
      initial="hidden"
      variants={variants}
      animate="visible"
      exit="hidden"
      className="relative rounded"
    >
      <CreateReplyComment commentId={commentId} />
    </motion.div>
  )
}

export default Replies
