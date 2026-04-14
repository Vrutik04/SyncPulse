import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import { getEmailError } from "../utils/AuthValidation";

export default function ForgotPassword() {
  const { resetPassword, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleReset = async () => {
    const err = getEmailError(email);

    if (err) {
      setEmailError(err);
      return;
    }

    setEmailError(null);

    await resetPassword(email.trim());

    Alert.alert("Success", "Check your email for reset link");
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Text className="text-3xl font-bold text-orange-500 mb-4">
        Reset Password 🔑
      </Text>

      <Text className="text-gray-500 mb-6">
        Enter your email to receive reset link
      </Text>

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-2"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      {emailError && <Text className="text-red-500">{emailError}</Text>}

      <TouchableOpacity
        onPress={handleReset}
        disabled={isLoading}
        className="bg-orange-500 py-4 rounded-xl items-center mt-4"
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold">
            Send Reset Link
          </Text>
        )}
      </TouchableOpacity>

      {error && <Text className="text-red-500 mt-4">{error}</Text>}
    </View>
  );
}