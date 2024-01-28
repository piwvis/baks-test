import { create } from "zustand";

export const useStartGame = create<{
  isStart: boolean;
  setStartGame: (value: boolean) => void;
}>((set) => ({
  isStart: false,
  setStartGame: (value) => set({ isStart: value }),
}));
