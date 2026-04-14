import { create } from "zustand";
import type { AuthState } from "../types/Auth.types";
import {
  loginUser,
  signupUser,
  resetUserPassword,
  logoutUser,
} from "../services/AuthServices";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  // 🔹 Set user (used by auth listener)
  setUser: (user) => set({ user }),

  // 🔹 Set loading (used by listener + actions)
  setLoading: (value) => set({ isLoading: value }),

  // 🔹 LOGIN
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const user = await loginUser(email, password);

      set({
        user,
        isLoading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Login failed",
        isLoading: false,
      });
    }
  },

  // 🔹 SIGNUP
  signup: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const user = await signupUser(email, password);

      set({
        user,
        isLoading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Signup failed",
        isLoading: false,
      });
    }
  },

  // 🔹 RESET PASSWORD
  resetPassword: async (email) => {
    try {
      set({ isLoading: true, error: null });

      await resetUserPassword(email);

      set({ isLoading: false });
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error ? error.message : "Reset password failed",
        isLoading: false,
      });
    }
  },

  // 🔹 LOGOUT
  logout: async () => {
    try {
      set({ isLoading: true, error: null });

      await logoutUser();

      set({
        user: null,
        isLoading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Logout failed",
        isLoading: false,
      });
    }
  },
}));