/* eslint-disable @typescript-eslint/no-misused-promises */
import React from "react";
import CreateComment from "./create-comments";
import Comment from "./comment";
import { trpc } from "@/utils/trpc";
import type { CommentProps } from "./create-comments";
import { ImSpinner8 } from "react-icons/im";
import { motion } from "framer-motion";
import { variants } from "@/utils/index";
import type { Comment as CommentType, User } from "@/types/types";

const Comments: React.FC<CommentProps> = ({ postId }) => {
  const { data, isLoading } = trpc.comment.getComments.useQuery({
    postId: postId,
    limit: 3,
  });

  return (
    <motion.div
      initial="hidden"
      variants={variants}
      animate="visible"
      exit="hidden"
      className="relative rounded"
    >
      {!isLoading ? (
        <div className="pb-4" id="comment">
          <CreateComment postId={postId} />
          <ul>
            {data?.comments?.map((comment) => (
              <li key={comment.id}>
                <Comment comment={comment as CommentType<User>} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-center justify-center py-4">
          <ImSpinner8 className="animate-spin text-2xl text-black" />
        </div>
      )}
    </motion.div>
  );
};

export default Comments;
