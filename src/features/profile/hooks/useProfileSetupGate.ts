import { useEffect, useMemo, useState } from "react";
import type { AuthUser } from "@/features/auth/types/Auth.types";
import { useProfileStore } from "../store/useProfileStore";

type UseProfileSetupGate = {
  user: AuthUser | null;
};

export const useProfileSetupGate = ({ user }: UseProfileSetupGate) => {
  const profile = useProfileStore((state) => state.user);
  const isUserLoading = useProfileStore((state) => state.isUserLoading);
  const [isProfileSetupVisible, setIsProfileSetupVisible] = useState(false);

  const shouldShowProfileSetup = useMemo(
    () => Boolean(user) && !isUserLoading && !profile?.name,
    [isUserLoading, profile?.name, user],
  );

  useEffect(() => {
    setIsProfileSetupVisible(shouldShowProfileSetup);
  }, [shouldShowProfileSetup]);

  const closeProfileSetupModal = () => {
    setIsProfileSetupVisible(false);
  };

  return {
    isProfileSetupVisible,
    closeProfileSetupModal,
  };
};
