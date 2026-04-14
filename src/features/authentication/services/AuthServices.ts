import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/features/authentication/config/Firebase";

// 🔥 Centralized Error Handler
const getFirebaseErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const msg = error.message;

    if (msg.includes("auth/invalid-email")) {
      return "Invalid email address";
    }

    if (msg.includes("auth/user-not-found")) {
      return "No account found with this email";
    }

    if (msg.includes("auth/wrong-password")) {
      return "Incorrect password";
    }

    if (msg.includes("auth/email-already-in-use")) {
      return "Email is already registered";
    }

    if (msg.includes("auth/weak-password")) {
      return "Password must be at least 6 characters";
    }

    if (msg.includes("auth/too-many-requests")) {
      return "Too many attempts. Try again later";
    }

    return msg;
  }

  return "Something went wrong. Please try again";
};

// 🔐 LOGIN
export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
};

// 📝 SIGNUP
export const signupUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const res = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return res.user;
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
};

// 🔁 RESET PASSWORD
export const resetUserPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
};

// 🚪 LOGOUT
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
};