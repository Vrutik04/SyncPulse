import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import {
  getEmailError,
  getPasswordError,
  getConfirmPasswordError,
} from "../utils/AuthValidation";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/navigation/types";
import type { SignupForm } from "../types/Auth.types";

export default function Signup() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { signup, isLoading, error } = useAuthStore();

  const [form, setForm] = useState<SignupForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<SignupForm>>({});

  const handleChange = (key: keyof SignupForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const newErrors: Partial<SignupForm> = {
      email: getEmailError(form.email) || undefined,
      password: getPasswordError(form.password) || undefined,
      confirmPassword:
        getConfirmPasswordError(
          form.password,
          form.confirmPassword
        ) || undefined,
    };

    setErrors(newErrors);

    return (
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.confirmPassword
    );
  };

  const handleSignup = () => {
    if (!validateForm()) 
      return;
    signup(form.email.trim(), form.password);
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
              className="w-48 h-48 rounded-2xl "
              resizeMode="contain"
            />
          </View>

          {/* Header Texts */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-extrabold text-white mb-2 shadow-sm">
              Create Account 🚀
            </Text>
            <Text className="text-gray-600 font-medium">
              Sign up to get started
            </Text>
          </View>

          {/* Form */}
          <View className="w-full space-y-4">
            <View className="mb-4">
              <TextInput
                className="bg-white/90 border border-white/40 rounded-2xl px-4 py-4 text-gray-800 shadow-sm"
                placeholder="Email"
                placeholderTextColor="#9ca3af"
                value={form.email}
                onChangeText={(v) => handleChange("email", v)}
                autoCapitalize="none"
              />
              {errors.email && (
                <Text className="text-red-500 mt-1 ml-2 text-sm">{errors.email}</Text>
              )}
            </View>

            <View className="mb-4">
              <TextInput
                className="bg-white/90 border border-white/40 rounded-2xl px-4 py-4 text-gray-800 shadow-sm"
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={form.password}
                onChangeText={(v) => handleChange("password", v)}
              />
              {errors.password && (
                <Text className="text-red-500 mt-1 ml-2 text-sm">{errors.password}</Text>
              )}
            </View>

            <View className="mb-6">
              <TextInput
                className="bg-white/90 border border-white/40 rounded-2xl px-4 py-4 text-gray-800 shadow-sm"
                placeholder="Confirm Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={(v) => handleChange("confirmPassword", v)}
              />
              {errors.confirmPassword && (
                <Text className="text-red-500 mt-1 ml-2 text-sm">{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={isLoading}
              className="bg-orange-500 py-4 rounded-2xl items-center shadow-md shadow-orange-500/30 w-full"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Sign Up
                </Text>
              )}
            </TouchableOpacity>

            {/* Error Message */}
            {error && <Text className="text-red-500 text-center mt-4 font-medium">{error}</Text>}

            {/* Login Link */}
            <View className="flex-row justify-center mt-5">
              <Text className="text-gray-600 font-medium">
                Already have an account?{" "}
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