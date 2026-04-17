import { useEffect, useMemo, useState } from "react";
import type { AuthUser } from "@/features/authentication/types/Auth.types";
import { useZustandStore } from "@/store/useZustandStore";

type UseProfileSetupGate = {
  user: AuthUser | null;
};

export const useProfileSetupGate = ({ user }: UseProfileSetupGate) => {
  const profile = useZustandStore((state) => state.user);
  const isUserLoading = useZustandStore((state) => state.isUserLoading);
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
