import { create } from "zustand";
import type { AuthState } from "../types/Auth.types";
import {
  loginUser,
  signupUser,
  resetUserPassword,
  logoutUser,
  deleteAccount as deleteAccountService,
} from "../services/AuthServices";
import { useZustandStore } from "@/store/useZustandStore";

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isLoading: true, // Default to true so app waits for auth check
  error: null,

  setAuthUser: (authUser) => set({ authUser }),

  //  LOGIN
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const user = await loginUser(email, password);

      set({
        authUser: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
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
        authUser: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
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
      useZustandStore.getState().clearUser();

      set({
        authUser: null,
        isLoading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Logout failed",
        isLoading: false,
      });
    }
  },

  // ❌ DELETE ACCOUNT
  deleteAccount: async () => {
    try {
      set({ isLoading: true, error: null });

      const uid = useAuthStore.getState().authUser?.uid;
      
      await deleteAccountService();
      
      if (uid) {
        useZustandStore.getState().clearUser();
      }

      set({
        authUser: null,
        isLoading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete account",
        isLoading: false,
      });
    }
  },
}));