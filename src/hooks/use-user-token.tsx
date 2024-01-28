import { create } from "zustand";

export const useUserToken = create<{
  token: string;
  setToken: (value: string) => void;
}>((set) => ({
  token: "",
  setToken: (value) => set({ token: value }),
}));
