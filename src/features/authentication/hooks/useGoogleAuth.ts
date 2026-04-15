import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/features/authentication/config/Firebase";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "553261484962-8cqm3ndhfmb4p0opcg7b3vsug0bjt7sj.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.authentication?.idToken;

      if (!idToken) return;

      const credential = GoogleAuthProvider.credential(idToken);

      signInWithCredential(auth, credential);
    }
  }, [response]);

  return {
    promptAsync,
    request,
  };
};