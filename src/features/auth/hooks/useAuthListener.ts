import { auth } from "@/config/firebase";
import { useAuthStore } from "@/features/auth/store/AuthStore";
import { useProfileStore } from "@/features/profile/store/useProfileStore";
import { useCheckinStore } from "@/features/check-in-out/store/useCheckinStore";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect } from "react";

export const useAuthListener = () => {
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  useEffect(() => {
    useAuthStore.setState({ isLoading: true, error: null });

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user: User | null) => {
        try {
          if (!user) {
            setAuthUser(null);
            useProfileStore.getState().clearUser();
            useCheckinStore.getState().clearActivities();
            return;
          }

          setAuthUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          });

          await useProfileStore.getState().syncUserFromAuth(user.uid, {
            name: user.displayName,
            email: user.email,
          });

          // Load daily activities for history and today's state
          await useCheckinStore.getState().loadActivities(user.uid);
        } catch (error) {
          console.log("Auth listener profile sync error:", error);
        } finally {
          useAuthStore.setState({ isLoading: false });
        }
      },
      (error) => {
        console.log("Auth Listener Error:", error);
        useAuthStore.setState({ isLoading: false });
      },
    );

    return unsubscribe;
  }, [setAuthUser]);
};
