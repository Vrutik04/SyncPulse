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
    if (!validateForm()) return;
    signup(form.email.trim(), form.password);
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Text className="text-3xl font-bold text-orange-500 mb-2">
        Create Account 🚀
      </Text>
      <Text className="text-gray-500 mb-8">
        Sign up to get started
      </Text>

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-2"
        placeholder="Email"
        value={form.email}
        onChangeText={(v) => handleChange("email", v)}
      />
      {errors.email && <Text className="text-red-500">{errors.email}</Text>}

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-2"
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(v) => handleChange("password", v)}
      />
      {errors.password && <Text className="text-red-500">{errors.password}</Text>}

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        placeholder="Confirm Password"
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(v) => handleChange("confirmPassword", v)}
      />
      {errors.confirmPassword && (
        <Text className="text-red-500">{errors.confirmPassword}</Text>
      )}

      <TouchableOpacity
        onPress={handleSignup}
        disabled={isLoading}
        className="bg-orange-500 py-4 rounded-xl items-center"
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-lg">
            Sign Up
          </Text>
        )}
      </TouchableOpacity>

      {error && <Text className="text-red-500 mt-4">{error}</Text>}

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        className="mt-6"
      >
        <Text className="text-center text-orange-500">
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}