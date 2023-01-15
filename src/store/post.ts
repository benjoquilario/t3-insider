import { create } from "zustand";

interface InitialState {
  postOpen: boolean;
  setPostOpen: (action: boolean) => void;
}

const usePostStore = create<InitialState>((set) => ({
  postOpen: false,
  setPostOpen: (action: boolean) => set({ postOpen: action }),
}));

export default usePostStore;
