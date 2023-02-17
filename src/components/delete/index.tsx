import React from "react";
import { toast } from "react-toastify";
import ModalDelete from "@/components/modal/modal-delete";
import { useSession } from "next-auth/react";
import usePostStore from "@/store/post";
import useCommentStore from "@/store/comment";
import {
  useMutateDeleteComment,
  useMutateDeletePost,
} from "@/lib/hooks/useDeleteMutation";

const Delete = () => {
  const { data: session } = useSession();
  const [isModalDeletePostOpen, setIsModalDeletePostOpen] = usePostStore(
    (store) => [store.isModalDeletePostOpen, store.setIsModalDeletePostOpen]
  );
  const currentPostId = usePostStore((store) => store.currentPostId);
  const commentId = useCommentStore((store) => store.commentId);
  const [isCommentModalOpen, setIsCommentModalOpen] = useCommentStore(
    (store) => [store.isCommentModalOpen, store.setIsCommentModalOpen]
  );

  const onSuccessPostDelete = () => {
    toast("Your post was deleted successfully", {
      type: "success",
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const mutateDeletePost = useMutateDeletePost(
    onSuccessPostDelete,
    session?.user?.id
  );
  const mutateDeleteComment = useMutateDeleteComment();

  const handleDeletePost = () => {
    mutateDeletePost({ id: currentPostId });
    setIsModalDeletePostOpen(false);
  };

  const handleDeleteComment = () => {
    mutateDeleteComment({ id: commentId });
    setIsCommentModalOpen(false);
  };

  return (
    <React.Fragment>
      {isModalDeletePostOpen && (
        <ModalDelete
          type="Post"
          handleDelete={handleDeletePost}
          isModalOpen={isModalDeletePostOpen}
          setIsModalOpen={setIsModalDeletePostOpen}
        />
      )}
      {isCommentModalOpen && (
        <ModalDelete
          type="Comment"
          handleDelete={handleDeleteComment}
          isModalOpen={isCommentModalOpen}
          setIsModalOpen={setIsCommentModalOpen}
        />
      )}
    </React.Fragment>
  );
};

export default Delete;
