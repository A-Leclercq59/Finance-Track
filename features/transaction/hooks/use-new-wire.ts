import { create } from "zustand";

type NewWireState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const useNewWire = create<NewWireState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useNewWire;
