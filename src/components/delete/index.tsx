import React from "react";
import { trpc } from "@/utils/trpc";
import { toast } from "react-toastify";
import ModalDelete from "../modal/modal-delete";
import { useSession } from "next-auth/react";
import usePostStore from "@/store/post";
import useCommentStore from "@/store/comment";

const Delete = () => {
  const utils = trpc.useContext();
  const { data: session } = useSession();
  const [isModalDeletePostOpen, setIsModalDeletePostOpen] = usePostStore(
    (store) => [store.isModalDeletePostOpen, store.setIsModalDeletePostOpen]
  );
  const currentPostId = usePostStore((store) => store.currentPostId);
  const commentId = useCommentStore((store) => store.commentId);
  const [isCommentModalOpen, setIsCommentModalOpen] = useCommentStore(
    (store) => [store.isCommentModalOpen, store.setIsCommentModalOpen]
  );

  const { mutate: mutateDeletePost, isLoading: isDeleteLoading } =
    trpc.post.deletePost.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await utils.post.getPosts.invalidate();
        await utils.post.getPostsById.invalidate({
          id: session?.user?.id,
          limit: 3,
        });
        toast("Your post was deleted successfully", {
          type: "success",
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      },
    });

  const { mutate: mutateDeleteComment } =
    trpc.comment.deleteComment.useMutation({
      onError: (e) => console.log(e.message),
      onSuccess: async () => {
        await utils.comment.getComments.invalidate();
      },
    });

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
