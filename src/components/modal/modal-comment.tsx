import React from "react";
import Button from "../shared/button";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

type ModalCommentProps = {
  handleEdit: () => void;
  handleDelete: () => void;
};

const ModalComment: React.FC<ModalCommentProps> = ({
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="relative">
      <ul className="flex flex-col justify-center">
        <li className="rounded px-3 transition duration-75 hover:bg-gray-700">
          <Button
            onClick={handleEdit}
            aria-label="Edit Comment"
            className="flex w-full items-center gap-2 py-1 text-white md:py-2"
          >
            <FaEdit />
            <span className="text-sm">Edit</span>
          </Button>
        </li>
        <li className="rounded px-3 transition duration-75 hover:bg-gray-700">
          <Button
            onClick={handleDelete}
            className="flex w-full items-center gap-2 py-1 text-white md:py-2"
            aria-label="Delete Comment"
          >
            <AiFillDelete />
            <span className="text-sm">Delete</span>
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default ModalComment;
