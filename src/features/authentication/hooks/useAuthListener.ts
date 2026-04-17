import { auth } from "@/config/firebase";
import { useAuthStore } from "@/features/authentication/store/AuthStore";
import { useZustandStore } from "@/store/useZustandStore";
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
            useZustandStore.getState().clearUser();
            return;
          }

          setAuthUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          });

          await useZustandStore.getState().syncUserFromAuth(user.uid, {
            name: user.displayName,
            email: user.email,
          });
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