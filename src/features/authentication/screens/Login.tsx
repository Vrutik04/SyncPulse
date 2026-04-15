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
import { getEmailError, getPasswordError } from "../utils/AuthValidation";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { LoginForm } from "../types/Auth.types";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import type { AuthStackParamList } from "@/navigation/types";
import { AntDesign } from "@expo/vector-icons";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function Login() {
  const navigation = useNavigation<NavigationProp>();
  const { login, isLoading, error } = useAuthStore();
const { promptAsync } = useGoogleAuth();
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
          <View className="items-center mb-6 mt-5  ">
            <Image
              source={require("../../../../assets/images/icon1.png")}
              className="w-48 h-48 rounded-2xl "
              resizeMode="contain"
            />
          </View>

          {/* Header Texts */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-extrabold text-white mb-2 shadow-sm">
              Welcome Back 👋
            </Text>
            <Text className="text-gray-600 font-medium">
              Login to SyncPulse
            </Text>
          </View>

          {/* Form */}
          <View className="w-full space-y-4">
            {/* Email */}
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
                <Text className="text-red-500 mt-1 ml-2 text-sm">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Password */}
            <View className="mb-2">
              <TextInput
                className="bg-white/90 border border-white/40 rounded-2xl px-4 py-4 text-gray-800 shadow-sm"
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={form.password}
                onChangeText={(v) => handleChange("password", v)}
              />
              {errors.password && (
                <Text className="text-red-500 mt-1 ml-2 text-sm">
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Forgot password */}
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              className="mb-8 items-end w-full"
            >
              <Text className="text-red-800 font-medium mr-1">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className="bg-orange-500 py-4 rounded-2xl items-center shadow-md shadow-orange-500/30"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-lg">Login</Text>
              )}
            </TouchableOpacity>

            {/* Error Message */}
            {error && (
              <Text className="text-red-500 text-center mt-4 font-medium">
                {error}
              </Text>
            )}

            {/* Signup Link */}
            <View className="flex-row justify-center mt-5">
              <Text className="text-gray-600 font-medium">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text className="text-red-800 font-bold">Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-3 text-gray-500">OR</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>
            {/* Google Sign In */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => promptAsync()}
              className="bg-white py-4 rounded-2xl flex-row items-center justify-center mt-4 border border-gray-200 shadow"
              style={{ elevation: 3 }}
            >
              <AntDesign name="google" size={20} color="#DB4437" />
              <Text className="text-gray-700 font-semibold text-base ml-3">
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
