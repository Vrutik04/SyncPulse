import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useZustandStore } from "@/store/useZustandStore";

type ProfileSetupModalProps = {
  visible: boolean;
  initialEmail?: string | null;
  onComplete: () => void;
  onSkip: () => void;
};

type ProfileSetupForm = {
  username: string;
  email: string;
  role: string;
};

export const ProfileSetupModal = ({
  visible,
  initialEmail,
  onComplete,
  onSkip,
}: ProfileSetupModalProps) => {
  const { colors } = useTheme();
  const { userProfile, updateUserProfile } = useZustandStore();

  const [form, setForm] = useState<ProfileSetupForm>({
    username: "",
    email: "",
    role: "",
  });

  const updateFormField = <K extends keyof ProfileSetupForm>(
    key: K,
    value: ProfileSetupForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!visible) return;

    setForm({
      username: userProfile.name === "user" ? "" : userProfile.name,
      email:
        initialEmail ||
        (userProfile.email === "user-email@gmail.com" ? "" : userProfile.email),
      role: userProfile.position === "position/role" ? "" : userProfile.position,
    });
  }, [initialEmail, userProfile.email, userProfile.name, userProfile.position, visible]);

  const isSubmitDisabled = useMemo(() => {
    return !form.username.trim() || !form.email.trim() || !form.role.trim();
  }, [form.email, form.role, form.username]);

  const handleSubmit = () => {
    if (isSubmitDisabled) return;

    updateUserProfile({
      name: form.username.trim(),
      email: form.email.trim(),
      position: form.role.trim(),
    });

    Alert.alert("Profile Saved", "Your profile saved successfully.");
    onComplete();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onSkip}
    >
      <View className="flex-1 bg-black/55 items-center justify-center px-5">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="w-full"
        >
          <View className="rounded-3xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 p-5 shadow-lg">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-2xl font-bold text-ink-900 dark:text-ink-50">
                  Set Up Your Profile
                </Text>
                <Text className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                  Complete your details so your team can identify you clearly.
                </Text>
              </View>
              <View className="h-11 w-11 rounded-full bg-clay/10 dark:bg-clay/20 items-center justify-center">
                <Ionicons name="person-circle-outline" size={24} color={colors.primary} />
              </View>
            </View>

            <View className="mt-5 gap-4">
              <View>
                <Text className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-1.5">
                  Username
                </Text>
                <TextInput
                  value={form.username}
                  onChangeText={(value) => updateFormField("username", value)}
                  placeholder="Enter your username"
                  placeholderTextColor="#a8aebc"
                  className="bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-2xl px-4 py-3 text-ink-900 dark:text-ink-50"
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-1.5">
                  Email
                </Text>
                <TextInput
                  value={form.email}
                  onChangeText={(value) => updateFormField("email", value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Enter your email"
                  placeholderTextColor="#a8aebc"
                  className="bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-2xl px-4 py-3 text-ink-900 dark:text-ink-50"
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-1.5">
                  Role / Position
                </Text>
                <TextInput
                  value={form.role}
                  onChangeText={(value) => updateFormField("role", value)}
                  placeholder="E.g. Developer, Manager"
                  placeholderTextColor="#a8aebc"
                  className="bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-2xl px-4 py-3 text-ink-900 dark:text-ink-50"
                />
              </View>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitDisabled}
              style={{ backgroundColor: isSubmitDisabled ? "#d8dee8" : colors.primary }}
              className="mt-6 rounded-2xl py-3.5 items-center"
            >
              <Text className="text-white font-bold text-base">Submit Profile</Text>
            </Pressable>

            <Pressable onPress={onSkip} className="mt-3 py-2 items-center">
              <Text className="text-sm font-semibold text-ink-500 dark:text-ink-400">
                Skip for now
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
