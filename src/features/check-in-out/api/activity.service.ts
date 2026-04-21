import { db } from "@/config/firebase";
import type { CheckinEntry, CheckoutEntry, DailyRecord } from "@/features/check-in-out/types/Checkinout";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const activitiesCollection = (userId: string) =>
  collection(db, "users", userId, "activities");

const activityDoc = (userId: string, date: string) =>
  doc(db, "users", userId, "activities", date);

// ── Save Check-In ─────────────────────────────────────────────────────────────
export const saveCheckIn = async (
  userId: string,
  date: string,
  data: CheckinEntry,
): Promise<void> => {
  const ref = activityDoc(userId, date);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // First time today — create the document
    await setDoc(ref, {
      date,
      checkIn: data,
      checkOut: null,
    });
  } else {
    // Already exists — only update checkIn
    await updateDoc(ref, { checkIn: data });
  }
};

// ── Save Check-Out ────────────────────────────────────────────────────────────
export const saveCheckOut = async (
  userId: string,
  date: string,
  data: CheckoutEntry,
): Promise<void> => {
  const ref = activityDoc(userId, date);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // Create document even if check-out happens without check-in (edge case)
    await setDoc(ref, {
      date,
      checkIn: null,
      checkOut: data,
    });
  } else {
    await updateDoc(ref, { checkOut: data });
  }
};

// ── Get activity for a specific date ─────────────────────────────────────────
export const getActivityByDate = async (
  userId: string,
  date: string,
): Promise<DailyRecord | null> => {
  const snap = await getDoc(activityDoc(userId, date));

  if (!snap.exists()) return null;

  const raw = snap.data();
  return {
    date: raw.date,
    Checkin: raw.checkIn ?? undefined,
    Checkout: raw.checkOut ?? undefined,
  };
};

// ── Get all activities (for History screen) ───────────────────────────────────
export const getAllActivities = async (
  userId: string,
): Promise<DailyRecord[]> => {
  const snap = await getDocs(activitiesCollection(userId));

  return snap.docs.map((docSnap) => {
    const raw = docSnap.data();
    return {
      date: raw.date,
      Checkin: raw.checkIn ?? undefined,
      Checkout: raw.checkOut ?? undefined,
    };
  });
};
