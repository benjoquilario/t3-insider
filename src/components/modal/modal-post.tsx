import React from "react";
import { variants } from "@/utils/index";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import Button from "../shared/button";

type ModalPostProps = {
  handleEdit: () => void;
  handleDelete: () => void;
} & React.HTMLProps<HTMLDivElement>;

const ModalPost = React.forwardRef<HTMLDivElement, ModalPostProps>(
  (props, ref) => {
    const { handleDelete, handleEdit } = props;
    return (
      <motion.div
        ref={ref}
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="absolute top-14 right-3 z-30 h-auto rounded border border-solid border-gray-300 bg-zinc-100"
      >
        <div className="relative">
          <ul className="w-full">
            <li className="rounded px-3 transition duration-75 hover:bg-zinc-200">
              <div>
                <Button
                  onClick={handleEdit}
                  aria-label="Edit Post"
                  className="flex w-full items-center gap-2 py-1 text-gray-800 md:py-2"
                >
                  <FaEdit />
                  <span className="text-sm">Edit Post</span>
                </Button>
              </div>
            </li>
            <li className="rounded px-3 transition duration-75 hover:bg-zinc-200">
              <div>
                <Button
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2 py-1 text-gray-800 md:py-2"
                  aria-label="Delete Post"
                >
                  <AiFillDelete />
                  <span className="text-sm">Delete Post</span>
                </Button>
              </div>
            </li>
          </ul>
        </div>
      </motion.div>
    );
  }
);

ModalPost.displayName = "ModalPost";

export default ModalPost;
