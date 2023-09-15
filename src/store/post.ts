import { create } from "zustand"
import type { SelectedFileType } from "@/types/types"

interface SelectedPost {
  id: string
  message: string
  selectedFile: SelectedFileType[]
}

interface InitialState {
  postOpen: boolean
  currentPostId: string
  isEditing: boolean
  isModalDeletePostOpen: boolean
  deleteImages: string[]
  isRemove: boolean
  selectedPost: SelectedPost
  setSelectedPost: (post: SelectedPost) => void
  clearSelectedPost: () => void
  setIsRemove: (action: boolean) => void
  setDeleteImages: (id: string) => void
  clearDeletedImages: () => void
  setIsModalDeletePostOpen: (action: boolean) => void
  setIsEditing: (action: boolean) => void
  setPostOpen: (action: boolean) => void
  setCurrentPostId: (id: string) => void
}

const usePostStore = create<InitialState>((set) => ({
  postOpen: false,
  currentPostId: "",
  isEditing: false,
  isModalDeletePostOpen: false,
  deleteImages: [],
  isRemove: false,
  selectedPost: {
    id: "",
    message: "",
    selectedFile: [],
  },
  setSelectedPost: (post: SelectedPost) => set({ selectedPost: post }),
  clearSelectedPost: () =>
    set({
      selectedPost: {
        id: "",
        message: "",
        selectedFile: [],
      },
    }),
  setIsRemove: (action: boolean) => set({ isRemove: action }),
  setDeleteImages: (id) => {
    set((state) => ({
      deleteImages: [id, ...state.deleteImages],
    }))
  },
  clearDeletedImages: () => set({ deleteImages: [] }),
  setIsModalDeletePostOpen: (action: boolean) =>
    set({ isModalDeletePostOpen: action }),
  setIsEditing: (action: boolean) => set({ isEditing: action }),
  setCurrentPostId: (id: string) => set({ currentPostId: id }),
  setPostOpen: (action: boolean) => set({ postOpen: action }),
}))

export default usePostStore
