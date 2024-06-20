"use client"

import React from "react"
import { variants } from "@/lib/variants"
import { motion } from "framer-motion"
import CreateComment from "./create-comment"

type CommentsProps = {
  postId: string
}

const Comments = (props: CommentsProps) => {
  const { postId } = props

  return (
    <motion.div
      initial="hidden"
      variants={variants}
      animate="visible"
      exit="hidden"
      className="relative rounded"
    >
      <CreateComment postId={postId} />
    </motion.div>
  )
}

export default Comments
