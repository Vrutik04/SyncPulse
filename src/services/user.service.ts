import { db } from "@/config/firebase";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export type UserProfile = {
  name: string;
  email: string;
  role: string;
};

type FirestoreUserProfile = UserProfile & {
  createdAt?: unknown;
};

const usersCollection = "users";
const validEmailRegex = /^\S+@\S+\.\S+$/;

const normalizeText = (value?: string | null): string =>
  typeof value === "string" ? value.trim() : "";

const normalizeEmail = (email?: string | null): string | null => {
  const trimmed = normalizeText(email).toLowerCase();
  if (!trimmed) return null;
  return validEmailRegex.test(trimmed) ? trimmed : null;
};

const normalizeName = (name?: string | null): string => normalizeText(name);
const normalizeRole = (role?: string | null): string => normalizeText(role);

const buildNormalizedProfile = ({
  name,
  email,
  role,
}: {
  name?: string | null;
  email?: string | null;
  role?: string | null;
}): UserProfile | null => {
  const safeEmail = normalizeEmail(email);
  if (!safeEmail) return null;

  return {
    name: normalizeName(name),
    email: safeEmail,
    role: normalizeRole(role),
  };
};



export const saveUserProfile = async (
  userId: string,
  data: UserProfile,
): Promise<void> => {
  const normalizedProfile = buildNormalizedProfile(data);
  if (!normalizedProfile) {
    throw new Error("Cannot save user profile without a valid email");
  }

  await setDoc(
    doc(db, usersCollection, userId),
    {
      ...normalizedProfile,
      createdAt: serverTimestamp(),
    },
    {
      mergeFields: [
        "name",
        "email",
        "role",
        "createdAt",
      ],
    },
  );
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userDoc = await getDoc(doc(db, usersCollection, userId));

  if (!userDoc.exists()) {
    return null;
  }

  const data = userDoc.data() as FirestoreUserProfile;
  return buildNormalizedProfile(data);
};

export const updateUserProfile = async (
  userId: string,
  data: Partial<UserProfile>,
): Promise<void> => {
  const payload: Partial<UserProfile> = {};

  if (typeof data.name === "string") {
    payload.name = normalizeName(data.name);
  }

  if (typeof data.email === "string") {
    const safeEmail = normalizeEmail(data.email);
    if (!safeEmail) {
      throw new Error("Cannot update user profile with an invalid email");
    }
    payload.email = safeEmail;
  }
  if (typeof data.role === "string") {
    payload.role = normalizeRole(data.role);
  }

  if (Object.keys(payload).length === 0) {
    return;
  }

  await updateDoc(doc(db, usersCollection, userId), payload);
};

type SyncUserProfileInput = {
  name?: string | null;
  email?: string | null;
};

export const syncUserProfile = async (
  userId: string,
  authFallback: SyncUserProfileInput,
): Promise<UserProfile> => {
  const userRef = doc(db, usersCollection, userId);

  return runTransaction(db, async (transaction) => {
    const snap = await transaction.get(userRef);
    const authEmail = normalizeEmail(authFallback.email);
    const authName = normalizeName(authFallback.name);

    if (!snap.exists()) {
      if (!authEmail) {
        throw new Error("Missing valid auth email for first-time profile creation");
      }

      const createdProfile: UserProfile = {
        name: authName,
        email: authEmail,
        role: "",
      };

      transaction.set(userRef, {
        ...createdProfile,
        createdAt: serverTimestamp(),
      });

      return createdProfile;
    }

    const existing = snap.data() as FirestoreUserProfile;
    const existingEmail = normalizeEmail(existing.email);
    const existingName = normalizeName(existing.name);
    const existingRole = normalizeRole(existing.role);

    const resolvedEmail = existingEmail ?? authEmail;
    if (!resolvedEmail) {
      throw new Error("User profile email is invalid and auth email is unavailable");
    }

    const resolvedName = existingName || authName;

    const nextProfile: UserProfile = {
      name: resolvedName,
      email: resolvedEmail,
      role: existingRole,
    };

    transaction.set(
      userRef,
      {
        name: nextProfile.name,
        email: nextProfile.email,
        role: nextProfile.role,
      },
      { merge: true },
    );

    return nextProfile;
  });
};



