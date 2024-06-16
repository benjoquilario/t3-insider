import React from "react"
import CommentItem from "./comment-item"

const CreateComment = () => {
  return (
    <div className="pb-4" id="comment">
      <div className="px-3 pt-4 md:px-5">
        {/* <CommentForm
          commentId={commentId}
          commentText={comment}
          reset={reset}
          register={register}
          handleCancel={cancelUpdate}
          onSubmit={handleSubmit(handleOnSubmit)}
        /> */}
      </div>
      <ul>
        <CommentItem />
        <CommentItem />
        <CommentItem />
      </ul>
    </div>
  )
}

export default CreateComment
