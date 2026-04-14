import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  // @ts-ignore
  getReactNativePersistence
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBqIq8jV4QhALhGKRcEi3K2HUWSQCj8n7w",
  authDomain: "syncpulse-app.firebaseapp.com",
  projectId: "syncpulse-app",
  storageBucket: "syncpulse-app.firebasestorage.app",
  messagingSenderId: "553261484962",
  appId: "1:553261484962:web:359d4de538e61dbe7600fb"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});