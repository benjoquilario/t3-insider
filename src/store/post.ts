import { create } from "zustand";

interface InitialState {
  postOpen: boolean;
  currentPostId: string;
  isEditing: boolean;
  isModalDeletePostOpen: boolean;
  deleteImages: string[];
  isRemove: boolean;
  setIsRemove: (action: boolean) => void;
  setDeleteImages: (id: string) => void;
  clearDeletedImages: () => void;
  setIsModalDeletePostOpen: (action: boolean) => void;
  setIsEditing: (action: boolean) => void;
  setPostOpen: (action: boolean) => void;
  setCurrentPostId: (id: string) => void;
}

const usePostStore = create<InitialState>((set) => ({
  postOpen: false,
  currentPostId: "",
  isEditing: false,
  isModalDeletePostOpen: false,
  deleteImages: [],
  isRemove: false,
  setIsRemove: (action: boolean) => set({ isRemove: action }),
  setDeleteImages: (id) => {
    set((state) => ({
      deleteImages: [id, ...state.deleteImages],
    }));
  },
  clearDeletedImages: () => set({ deleteImages: [] }),
  setIsModalDeletePostOpen: (action: boolean) =>
    set({ isModalDeletePostOpen: action }),
  setIsEditing: (action: boolean) => set({ isEditing: action }),
  setCurrentPostId: (id: string) => set({ currentPostId: id }),
  setPostOpen: (action: boolean) => set({ postOpen: action }),
}));

export default usePostStore;
