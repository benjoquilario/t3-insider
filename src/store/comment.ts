import { create } from "zustand"

interface InitialState {
  commentId: string
  replyId: string
  replyComment: string
  commentMessage: string
  isCommentModalOpen: boolean
  setIsCommentModalOpen: (arg: boolean) => void
  setCommentMessage: (message: string) => void
  setReplyComment: (reply: string) => void
  setReplyId: (id: string) => void
  setCommentId: (id: string) => void
}

const useCommentStore = create<InitialState>((set) => ({
  commentId: "",
  replyId: "",
  replyComment: "",
  commentMessage: "",
  isCommentModalOpen: false,
  setIsCommentModalOpen: (arg: boolean) => set({ isCommentModalOpen: arg }),
  setCommentMessage: (message: string) => set({ commentMessage: message }),
  setReplyComment: (reply: string) => set({ replyComment: reply }),
  setReplyId: (id: string) => set({ replyId: id }),
  setCommentId: (id: string) => set({ commentId: id }),
}))

export default useCommentStore
