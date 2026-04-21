import { create } from "zustand";
import type { UserProfile } from "../api/user.service";
import { 
  getUserProfile, 
  saveUserProfile, 
  syncUserProfile, 
  updateUserProfile as updateUserProfileService 
} from "../api/user.service";

export type ThemePreference = "system" | "light" | "dark";
const ThemeOptions: ThemePreference[] = ["system", "light", "dark"];

interface ProfileState {
  user: UserProfile | null;
  isUserLoading: boolean;
  profileImage: string | null;
  theme: ThemePreference;
  setUser: (user: UserProfile | null) => void;
  fetchUser: (userId: string) => Promise<UserProfile | null>;
  createUser: (userId: string, data: UserProfile) => Promise<void>;
  syncUserFromAuth: (
    userId: string,
    data: { name?: string | null; email?: string | null }
  ) => Promise<UserProfile>;
  updateUser: (userId: string, data: Partial<UserProfile>) => Promise<void>;
  clearUser: () => void;
  setProfileImage: (imageUri: string) => void;
  clearProfileImage: () => void;
  setTheme: (value: ThemePreference) => void;
  toggleTheme: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  user: null,
  isUserLoading: false,
  profileImage: null,
  theme: "system",

  setUser: (user) => set({ user }),

  fetchUser: async (userId) => {
    set({ isUserLoading: true });
    try {
      const profile = await getUserProfile(userId);
      set({ user: profile });
      return profile;
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      throw error;
    } finally {
      set({ isUserLoading: false });
    }
  },

  createUser: async (userId, data) => {
    set({ isUserLoading: true });
    try {
      await saveUserProfile(userId, data);
      set({ user: data });
    } catch (error) {
      console.error("Failed to create user profile", error);
      throw error;
    } finally {
      set({ isUserLoading: false });
    }
  },

  syncUserFromAuth: async (userId, data) => {
    set({ isUserLoading: true });
    try {
      const profile = await syncUserProfile(userId, data);
      set({ user: profile });
      return profile;
    } catch (error) {
      console.error("Failed to sync user profile", error);
      throw error;
    } finally {
      set({ isUserLoading: false });
    }
  },

  updateUser: async (userId, data) => {
    const currentUser = get().user;
    if (!currentUser) throw new Error("Profile not loaded");

    set({ isUserLoading: true });
    try {
      await updateUserProfileService(userId, data);
      set({ user: { ...currentUser, ...data } });
    } catch (error) {
      console.error("Failed to update user profile", error);
      throw error;
    } finally {
      set({ isUserLoading: false });
    }
  },

  clearUser: () => set({ user: null, profileImage: null }),
  setProfileImage: (imageUri) => set({ profileImage: imageUri }),
  clearProfileImage: () => set({ profileImage: null }),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => {
    const index = ThemeOptions.indexOf(state.theme);
    const nextTheme = ThemeOptions[(index + 1) % ThemeOptions.length];
    return { theme: nextTheme };
  }),
}));
