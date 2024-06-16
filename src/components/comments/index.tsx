"use client"

import React from "react"
import { variants } from "@/lib/variants"
import { motion } from "framer-motion"
import CreateComment from "./create-comment"

const Comments = () => {
  return (
    <motion.div
      initial="hidden"
      variants={variants}
      animate="visible"
      exit="hidden"
      className="relative rounded"
    >
      <CreateComment />
    </motion.div>
  )
}

export default Comments
