
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { createJSONStorage, type StateStorage } from "zustand/middleware";

const webLocalStorage = (): StateStorage => ({
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(name, value);
    } catch {
      
    }
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(name);
    } catch {
      
    }
  },
});

export const checkInPersistStorage = createJSONStorage(() =>
  Platform.OS === "web" ? webLocalStorage() : AsyncStorage
);

