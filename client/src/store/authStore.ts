"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/login", { email, password });
          localStorage.setItem("accessToken", data.accessToken);
          set({ user: data.user, token: data.accessToken, isLoading: false });
        } catch (err: unknown) {
          set({ isLoading: false });
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Login failed";
          throw new Error(msg);
        }
      },

      // register now auto-logs in — no OTP step
      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/register", { name, email, password });
          localStorage.setItem("accessToken", data.accessToken);
          set({ user: data.user, token: data.accessToken, isLoading: false });
        } catch (err: unknown) {
          set({ isLoading: false });
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Registration failed";
          throw new Error(msg);
        }
      },

      logout: async () => {
        try { await api.post("/logout"); } catch { /* ignore */ }
        localStorage.removeItem("accessToken");
        set({ user: null, token: null });
      },

      fetchProfile: async () => {
        try {
          const { data } = await api.get("/profile");
          set({ user: data.user });
        } catch { /* ignore */ }
      },
    }),
    { name: "auth-store", partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
