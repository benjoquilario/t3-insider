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
}

const usePostStore = create<InitialPost>((set) => ({
  isPostOpen: false,
  setIsPostOpen: (isPostOpen: boolean) => set({ isPostOpen }),
  currentPostId: "",
  setCurrentPostId: (currentPostId: string) => set({ currentPostId }),
  selectPost: {
    id: "",
    content: "",
    selectedFile: [],
  },

  setSelectPost: (selectPost: ISelectPost) => set({ selectPost }),
  clearSelectPost: () =>
    set({
      selectPost: {
        id: "",
        content: "",
        selectedFile: [],
      },
    }),

  isEditing: false,
  setIsEditing: (isEditing: boolean) => set({ isEditing }),
}))

export default usePostStore
