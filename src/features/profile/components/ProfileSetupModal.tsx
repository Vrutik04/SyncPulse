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
import { useAuthStore } from "@/features/authentication/store/AuthStore";

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
  onComplete,
  onSkip,
}: ProfileSetupModalProps) => {
  const { colors } = useTheme();
  const user = useZustandStore((state) => state.user);
  const updateUser = useZustandStore((state) => state.updateUser);
  const authUser = useAuthStore((state) => state.authUser);

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

    const authEmail = authUser?.email ?? "";
    setForm({
      username: user?.name ?? "",
      email: authEmail,
      role: user?.role ?? "",
    });
  }, [authUser?.email, user?.name, user?.role, visible]);

  const isSubmitDisabled = useMemo(() => {
    return !form.username.trim() || !form.email.trim();
  }, [form.email, form.username]);

  const handleSubmit = async () => {
    if (isSubmitDisabled) return;

    const authEmail = authUser?.email?.trim();
    if (!authUser || !authEmail) return;

    try {
      await updateUser(authUser.uid, {
        name: form.username.trim(),
        email: authEmail,
        role: form.role.trim(),
      });

      Alert.alert("Profile Saved", "Your profile saved successfully.");
      onComplete();
    } catch {
      Alert.alert("Error", "Could not save profile. Please try again.");
    }
  };

  const handleSkip = async () => {
    const authEmail = authUser?.email?.trim();
    if (authUser && authEmail) {
      try {
        await updateUser(authUser.uid, {
          name: "User",
          email: authEmail,
          role: "",
        });
      } catch {
        Alert.alert("Error", "Could not save default profile.");
        return;
      }
    }
    onSkip();
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
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={false}
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
                  placeholder="Enter your role"
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

            <Pressable onPress={handleSkip} className="mt-3 py-2 items-center">
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
