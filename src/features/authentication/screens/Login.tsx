import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import {
  getEmailError,
  getPasswordError,
} from "../utils/AuthValidation";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { LoginForm } from "../types/Auth.types";

import type { AuthStackParamList } from "@/navigation/types";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function Login() {
  const navigation = useNavigation<NavigationProp>();
  const { login, isLoading, error } = useAuthStore();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  const handleChange = (key: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const newErrors: Partial<LoginForm> = {
      email: getEmailError(form.email) || undefined,
      password: getPasswordError(form.password) || undefined,
    };

    setErrors(newErrors);

    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = () => {
    if (!validateForm()) return;
    login(form.email.trim(), form.password);
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Text className="text-3xl font-bold text-orange-500 mb-2">
        Welcome Back 👋
      </Text>
      <Text className="text-gray-500 mb-8">Login to SyncPulse</Text>

      {/* Email */}
      <View className="mb-4">
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3"
          placeholder="Email"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
          autoCapitalize="none"
        />
        {errors.email && (
          <Text className="text-red-500 mt-1">{errors.email}</Text>
        )}
      </View>

      {/* Password */}
      <View className="mb-2">
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3"
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(v) => handleChange("password", v)}
        />
        {errors.password && (
          <Text className="text-red-500 mt-1">{errors.password}</Text>
        )}
      </View>

      {/* Forgot */}
      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPassword")}
        className="mb-6"
      >
        <Text className="text-orange-500 text-right">
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Button */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading}
        className="bg-orange-500 py-4 rounded-xl items-center"
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-lg">
            Login
          </Text>
        )}
      </TouchableOpacity>

      {/* Firebase Error */}
      {error && (
        <Text className="text-red-500 text-center mt-4">{error}</Text>
      )}

      {/* Signup */}
      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-600">Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text className="text-orange-500 font-semibold">
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}