import { create } from 'zustand';

export const useColorPalette = create((set) => ({
  dominant: '#ffffff',
  secondary: '#000000',
  accent: '#3b82f6',
  
  setColor: (key, value) => set({ [key]: value }),

  setPalette: (colors) => set({
    dominant: colors.dominant,
    secondary: colors.secondary,
    accent: colors.accent,
  }),
}));