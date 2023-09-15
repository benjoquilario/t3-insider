import React from "react"
import { variants } from "@/lib/utils/index"
import { motion } from "framer-motion"
import { FaEdit } from "react-icons/fa"
import { AiFillDelete } from "react-icons/ai"
import Button from "@/components/shared/button"
import { BiBookmark } from "react-icons/bi"
import classNames from "classnames"

type ModalPostProps = {
  handleEdit: () => void
  handleDelete: () => void
} & React.HTMLProps<HTMLDivElement>

type ModalButtonProps = {
  handleClick: () => void
  children: React.ReactNode
  name: string
  className?: string
}

const ModalButton: React.FC<ModalButtonProps> = ({
  handleClick,
  children,
  name,
  className,
}) => {
  return (
    <li
      className={classNames(
        "rounded px-3 transition duration-75 hover:bg-zinc-200",
        className
      )}
    >
      <div>
        <Button
          onClick={handleClick}
          type="button"
          className="flex w-full items-center gap-2 py-2 text-zinc-800"
          aria-label={name}
        >
          {children}
          <span className="text-sm">{name}</span>
        </Button>
      </div>
    </li>
  )
}

const ModalPost = React.forwardRef<HTMLDivElement, ModalPostProps>(
  (props, ref) => {
    const { handleDelete, handleEdit } = props
    return (
      <motion.div
        ref={ref}
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="absolute right-3 top-14 z-30 h-auto rounded-md border-zinc-300 bg-zinc-100 shadow"
      >
        <div className="relative">
          <ul className="w-full">
            <ModalButton handleClick={handleEdit} name="Edit Post">
              <FaEdit />
            </ModalButton>
            <ModalButton handleClick={handleDelete} name="Delete Post">
              <AiFillDelete />
            </ModalButton>
            <ModalButton handleClick={handleEdit} name="Bookmark">
              <BiBookmark />
            </ModalButton>
          </ul>
        </div>
      </motion.div>
    )
  }
)

ModalPost.displayName = "ModalPost"

export default ModalPost
