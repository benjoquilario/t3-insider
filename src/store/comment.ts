import { create } from "zustand"

interface ISelectComment {
  comment: string
  commentId: string
}

interface IInitialComment {
  selectedComment: {
    commentId: string
    comment: string
  }
  commentId: string
  setCommentId: (commentId: string) => void
  clearSelectedComment: () => void
  setSelectedComment: (selectedComment: ISelectComment) => void
}

const useCommentStore = create<IInitialComment>((set) => ({
  selectedComment: {
    commentId: "",
    comment: "",
  },
  commentId: "",
  setCommentId: (commentId) => set({ commentId }),
  clearSelectedComment: () =>
    set({
      selectedComment: {
        commentId: "",
        comment: "",
      },
      commentId: "",
    }),
  setSelectedComment: (selectedComment) => set({ selectedComment }),
}))

export default useCommentStore
