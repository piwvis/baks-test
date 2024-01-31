import { create } from "zustand";

export const useStateUser = create<{
  userToken: string;
  setUserToken: (value: string) => void;
}>((set) => ({
  userToken: "",
  setUserToken: (value) => set({ userToken: value }),
}));
