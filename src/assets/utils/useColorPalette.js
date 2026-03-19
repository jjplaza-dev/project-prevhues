import { create } from 'zustand';

export const useColorPalette = create((set) => ({
  dominant: '#ffffff',
  secondary: '#000000',
  accent: '#3b82f6',
  setColor: (key, value) => set({ [key]: value }),
}));