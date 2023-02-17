import { create } from "zustand";

interface InitialState {
  isNavOpen: boolean;
  setIsNavOpen: (arg: boolean) => void;
}

const useNavStore = create<InitialState>((set) => ({
  isNavOpen: false,
  setIsNavOpen: (arg: boolean) => set({ isNavOpen: arg }),
}));

export default useNavStore;
