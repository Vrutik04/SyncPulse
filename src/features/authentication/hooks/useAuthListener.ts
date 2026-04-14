import { useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/features/authentication/config/Firebase";
import { useAuthStore } from "@/features/authentication/store/AuthStore";

export const useAuthListener = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    // Start loading while checking auth state
    setLoading(true);

    const unsubscribe = onAuthStateChanged(
      auth,
      (user: User | null) => {
        setUser(user);
        setLoading(false); 
        //  stop loading after check
      },
      (error) => {
        console.log("Auth Listener Error:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);
};