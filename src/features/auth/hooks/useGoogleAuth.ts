import { auth } from "@/config/firebase";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect } from "react";


WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "553261484962-8cqm3ndhfmb4p0opcg7b3vsug0bjt7sj.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      if (id_token) {
        const credential = GoogleAuthProvider.credential(id_token);

        signInWithCredential(auth, credential).catch((error) => {
          console.error("Firebase Google Auth Error:", error);
        });
      }
    }
  }, [response]);

  return {
    promptAsync,
    request,
  };
};
