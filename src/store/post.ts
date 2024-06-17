import { create } from "zustand"

interface ISelectPost {
  id: string
  content: string
  selectedFile: ISelectedFile[]
}

interface InitialPost {
  isPostOpen: boolean
  setIsPostOpen: (isPostOpen: boolean) => void
  currentPostId: string
  setCurrentPostId: (currentPostId: string) => void
  selectPost: {
    id: string
    content: string
    selectedFile: ISelectedFile[]
  }
  clearSelectPost: () => void
  setSelectPost: (selectPost: ISelectPost) => void
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
  currentPostId: "",
  setCurrentPostId: (currentPostId) => set({ currentPostId }),
  selectPost: {
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
  setSelectPost: (selectPost) => set({ selectPost }),
  clearSelectPost: () =>
    set({
      selectPost: {
        id: "",
        content: "",
        selectedFile: [],
      },
    }),

  isEditing: false,
  setIsEditing: (isEditing) => set({ isEditing }),
}))

export default usePostStore
