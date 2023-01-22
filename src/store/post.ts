import { create } from "zustand";

interface InitialState {
  postOpen: boolean;
  currentPostId: string;
  commentId: string;
  isEditing: boolean;
  setIsEditing: (action: boolean) => void;
  setPostOpen: (action: boolean) => void;
  setCurrentPostId: (id: string) => void;
  setCommentId: (id: string) => void;
}

const usePostStore = create<InitialState>((set) => ({
  postOpen: false,
  currentPostId: "",
  isEditing: false,
  commentId: "",
  setCommentId: (id: string) => set({ commentId: id }),
  setIsEditing: (action: boolean) => set({ isEditing: action }),
  setCurrentPostId: (id: string) => set({ currentPostId: id }),
  setPostOpen: (action: boolean) => set({ postOpen: action }),
}));

export default usePostStore;
