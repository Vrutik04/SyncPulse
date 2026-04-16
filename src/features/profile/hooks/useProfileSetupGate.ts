import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { useZustandStore } from "@/store/useZustandStore";

const ISO_DATE_TIME_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

const getSafeIsoTime = (value?: string) => {
  if (!value || !ISO_DATE_TIME_REGEX.test(value)) return null;
  const parsedTime = Date.parse(value);
  return Number.isNaN(parsedTime) ? null : parsedTime;
};

type UseProfileSetupGate = {
  user: User | null;
};

export const useProfileSetupGate = ({ user }: UseProfileSetupGate) => {
  const hasHydrated = useZustandStore((state) => state.hasHydrated);
  const hasSeenProfileSetup = useZustandStore((state) => state.hasSeenProfileSetup);
  const markProfileSetupSeen = useZustandStore((state) => state.markProfileSetupSeen);
  const [isProfileSetupVisible, setIsProfileSetupVisible] = useState(false);

  const isFirstSignIn = useMemo(() => {
    if (!user) return false;
    const createdAt = getSafeIsoTime(user.metadata.creationTime);
    const lastSignInAt = getSafeIsoTime(user.metadata.lastSignInTime);

    if (createdAt === null || lastSignInAt === null) return false;
    return createdAt === lastSignInAt;
  }, [user]);

  useEffect(() => {
    if (!hasHydrated || !user) {
      setIsProfileSetupVisible(false);
      return;
    }

    if (isFirstSignIn && !hasSeenProfileSetup(user.uid)) {
      setIsProfileSetupVisible(true);
    } else {
      setIsProfileSetupVisible(false);
    }
  }, [hasHydrated, hasSeenProfileSetup, isFirstSignIn, user]);

  const closeProfileSetupModal = () => {
    if (!user) return;
    markProfileSetupSeen(user.uid);
    setIsProfileSetupVisible(false);
  };

  return {
    hasHydrated,
    isProfileSetupVisible,
    closeProfileSetupModal,
  };
};
