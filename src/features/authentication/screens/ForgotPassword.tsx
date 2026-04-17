import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../store/AuthStore";
import { getEmailError } from "../utils/AuthValidation";
import type { AuthStackParamList } from "@/navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>

export default function ForgotPassword() {
  const { resetPassword, isLoading, error } = useAuthStore();
  const navigation = useNavigation<NavigationProp>();

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
    <ImageBackground
      source={require("../../../../assets/images/background.jpg")}
      className="flex-1 bg-orange-50"
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View className="items-center mb-6 mt-5">
            <Image
              source={require("../../../../assets/images/icon1.png")}
              className="w-48 h-48 rounded-2xl"
              resizeMode="contain"
            />
          </View>

          {/* Header Texts */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-extrabold text-white mb-2 shadow-sm text-center">
              Reset Password 🔑
            </Text>
            <Text className="text-gray-600 font-medium text-center">
              Enter your email to receive reset link
            </Text>
          </View>

          {/* Form */}
          <View className="w-full space-y-4">
            <View className="mb-6">
              <TextInput
                className="bg-white/90 border border-white/40 rounded-2xl px-4 py-4 text-gray-800 shadow-sm"
                placeholder="Email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
              {emailError && (
                <Text className="text-red-500 mt-1 ml-2 text-sm">
                  {emailError}
                </Text>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleReset}
              disabled={isLoading}
              className="bg-orange-500 py-4 rounded-2xl items-center shadow-md shadow-orange-500/30 w-full"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Send Reset Link
                </Text>
              )}
            </TouchableOpacity>

            {error && (
              <Text className="text-red-700 text-center mt-4 font-medium">
                {error}
              </Text>
            )}

            {/* Back to Login Link */}
            <View className="flex-row justify-center mt-5">
              <Text className="text-gray-600 font-medium">
                Remember your password?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-red-800 font-bold">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
