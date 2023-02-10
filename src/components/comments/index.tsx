/* eslint-disable @typescript-eslint/no-misused-promises */
import React from "react";
import CreateComment from "./create-comments";
import { trpc } from "@/utils/trpc";
import type { CommentProps } from "./create-comments";

import { motion } from "framer-motion";
import { variants } from "@/utils/index";

const Comments: React.FC<CommentProps> = ({ postId }) => (
  <motion.div
    initial="hidden"
    variants={variants}
    animate="visible"
    exit="hidden"
    className="relative rounded"
  >
    <CreateComment postId={postId} />
  </motion.div>
);

export default Comments;
