"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: true,
      toggle: () => {
        const next = !get().isDark;
        set({ isDark: next });
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
        }
      },
    }),
    { name: "theme-store" }
  )
);
