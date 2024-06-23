import { create } from "zustand"

interface ISelectPost {
  id: string
  content: string
  selectedFile: ISelectedFile[]
}

interface InitialPost {
  isPostOpen: boolean
  setIsPostOpen: (isPostOpen: boolean) => void
  selectedPostId: string
  setSelectedPostId: (currentPostId: string) => void
  selectedPost: {
    id: string
    content: string
    selectedFile: ISelectedFile[]
  }
  clearSelectedPost: () => void
  setSelectedPost: (selectPost: ISelectPost) => void
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  deletedFiles: string[]
  setDeletedFiles: (id: string) => void
  clearDeletedFiles: () => void
  deletedKeys: string[]
  setDeletedKeys: (key: string) => void
  clearDeletedKeys: () => void
}

const usePostStore = create<InitialPost>((set) => ({
  isPostOpen: false,
  setIsPostOpen: (isPostOpen) => set({ isPostOpen }),
  selectedPostId: "",
  setSelectedPostId: (selectedPostId) => set({ selectedPostId }),
  selectedPost: {
    id: "",
    content: "",
    selectedFile: [],
  },
  deletedKeys: [],
  setDeletedKeys: (key) =>
    set((state) => ({ deletedKeys: [key, ...state.deletedKeys] })),
  clearDeletedKeys: () => set({ deletedKeys: [] }),
  deletedFiles: [],
  setDeletedFiles: (id) =>
    set((state) => ({ deletedFiles: [id, ...state.deletedFiles] })),
  clearDeletedFiles: () => set({ deletedFiles: [] }),
  setSelectedPost: (selectedPost) => set({ selectedPost }),
  clearSelectedPost: () =>
    set({
      selectedPost: {
        id: "",
        content: "",
        selectedFile: [],
      },
    }),

  isEditing: false,
  setIsEditing: (isEditing) => set({ isEditing }),
}))

export default usePostStore
