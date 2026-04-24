import { ScreenContainer } from "@/shared/components/ScreenContainer";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";

import { useAuthStore } from "@/features/auth/store/AuthStore";
import { computeStreak } from "@/shared/utils/progress";
import { useProfileStore } from "@/features/profile/store/useProfileStore";
import { useCheckinStore } from "@/features/check-in-out/store/useCheckinStore";

// App version
const version =
  Constants.expoConfig?.version ??
  Constants.expoConfig?.runtimeVersion?.toString() ??
  "—";

// Types
type FormState = {
  name: string;
  email: string;
  role: string;
};

type UIState = {
  isEditModalVisible: boolean;
  loading: boolean;
  errors: {
    name?: string;
    email?: string;
  };
};

export const ProfileScreen = () => {
  const entries = useCheckinStore((state) => state.entries);
  const user = useProfileStore((state) => state.user);
  const updateUser = useProfileStore((state) => state.updateUser);
  const profileImage = useProfileStore((state) => state.profileImage);
  const setProfileImage = useProfileStore((state) => state.setProfileImage);
  const { logout, deleteAccount, authUser } = useAuthStore();

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? All your check-in data and profile will be permanently removed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteAccount
        }
      ]
    );
  };

  const streak = computeStreak(entries);
  const totalCheckins = Object.values(entries).filter((e) => e.Checkin).length;

  // State
  const [form, setForm] = useState<FormState>({
    name: user?.name ?? "",
    email: user?.email ?? authUser?.email ?? "",
    role: user?.role ?? "",
  });

  const [ui, setUI] = useState<UIState>({
    isEditModalVisible: false,
    loading: false,
    errors: {},
  });

  const updateForm = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateUI = <K extends keyof UIState>(key: K, value: UIState[K]) => {
    setUI((prev) => ({ ...prev, [key]: value }));
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!authUser) return;

    try {
      await updateUser(authUser.uid, {
        name: form.name,
        email: form.email,
        role: form.role,
      });
      updateUI("isEditModalVisible", false);
    } catch {
      Alert.alert("Error", "Could not update profile. Please try again.");
    }
  };

  const openEditModal = () => {
    setForm({
      name: user?.name ?? "",
      email: user?.email ?? authUser?.email ?? "",
      role: user?.role ?? "",
    });
    updateUI("isEditModalVisible", true);
  };

  return (
    <ScreenContainer title="Profile" subtitle="Your account details">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ── User hero card ── */}
        <View className="mb-6 items-center pt-6 pb-2">
          <View className="relative shadow-sm">
            <Pressable onPress={handlePickImage} className="relative active:opacity-80">
              <View className="h-24 w-24 rounded-full bg-clay/10 dark:bg-clay/20 items-center justify-center border-[3px] border-white dark:border-ink-800 shadow-md overflow-hidden">
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={48} color="#c45c3e" />
                )}
              </View>
              {/* Camera overlay badge */}
              <View className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-clay items-center justify-center border-[3px] border-white dark:border-ink-900 shadow-sm">
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </Pressable>
          </View>

          <Text className="mt-4 text-xl font-extrabold text-ink-900 dark:text-ink-50 tracking-tight">
            {user?.name || "User"}
          </Text>
          <Text className="mt-1 text-xs font-medium text-ink-500 dark:text-ink-400">
            {user?.email || authUser?.email || "No email provided"}
          </Text>
          
          {user?.role ? (
            <View className="bg-clay/10 dark:bg-clay/20 px-3 py-1 rounded-full mt-3 border border-clay/20 dark:border-clay/30">
              <Text className="text-[10px] font-bold text-clay dark:text-clay-muted tracking-widest uppercase">
                {user.role}
              </Text>
            </View>
          ) : null}
        </View>

        {/*  Stats row */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-ink-900 dark:text-ink-50 mb-3 px-2 uppercase tracking-wider">
            Your Activity
          </Text>
          <View className="flex-row gap-3">
            {/* Streak */}
            <View className="flex-1 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4 shadow-sm">
              <View className="flex-row items-center justify-between mb-2">
                <View className="h-8 w-8 rounded-full bg-orange-50 dark:bg-clay/10 items-center justify-center">
                  <Ionicons name="flame" size={16} color="#c45c3e" />
                </View>
              </View>
              <Text className="text-2xl font-black text-ink-900 dark:text-ink-50 mb-0.5">
                {streak}
              </Text>
              <Text className="text-[10px] font-semibold text-ink-500 dark:text-ink-400 tracking-wide uppercase">
                Day Streak
              </Text>
            </View>

            {/* Check-ins */}
            <View className="flex-1 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4 shadow-sm">
              <View className="flex-row items-center justify-between mb-2">
                <View className="h-8 w-8 rounded-full bg-green-50 dark:bg-green-900/20 items-center justify-center">
                  <Ionicons name="checkmark-done" size={16} color="#16a34a" />
                </View>
              </View>
              <Text className="text-2xl font-black text-ink-900 dark:text-ink-50 mb-0.5">
                {totalCheckins}
              </Text>
              <Text className="text-[10px] font-semibold text-ink-500 dark:text-ink-400 tracking-wide uppercase">
                Total Check-ins
              </Text>
            </View>
          </View>
        </View>

        {/* Settings menu */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-ink-900 dark:text-ink-50 mb-3 px-2 uppercase tracking-wider">
            Settings
          </Text>
          <View className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl overflow-hidden shadow-sm">
            <Pressable
              onPress={openEditModal}
              className="flex-row items-center p-3.5 border-b border-ink-100 dark:border-ink-800 active:bg-ink-50 dark:active:bg-ink-800"
            >
              <View className="w-8 h-8 rounded-[10px] bg-orange-50 dark:bg-clay/10 items-center justify-center mr-3">
                <Ionicons name="person-outline" size={16} color="#c45c3e" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-ink-900 dark:text-ink-50">
                  Edit Profile
                </Text>
                <Text className="text-[10px] font-medium text-ink-500 dark:text-ink-400 mt-0.5">
                  Update personal details
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#a8aebc" />
            </Pressable>

            <Pressable className="flex-row items-center p-3.5 border-b border-ink-100 dark:border-ink-800 active:bg-ink-50 dark:active:bg-ink-800">
              <View className="w-8 h-8 rounded-[10px] bg-orange-50 dark:bg-clay/10 items-center justify-center mr-3">
                <Ionicons name="notifications-outline" size={16} color="#c45c3e" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-ink-900 dark:text-ink-50">
                  Notifications
                </Text>
                <Text className="text-[10px] font-medium text-ink-500 dark:text-ink-400 mt-0.5">
                  Manage reminder alerts
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#a8aebc" />
            </Pressable>

            <Pressable className="flex-row items-center p-3.5 active:bg-ink-50 dark:active:bg-ink-800">
              <View className="w-8 h-8 rounded-[10px] bg-orange-50 dark:bg-clay/10 items-center justify-center mr-3">
                <Ionicons name="shield-checkmark-outline" size={16} color="#c45c3e" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-ink-900 dark:text-ink-50">
                  Security
                </Text>
                <Text className="text-[10px] font-medium text-ink-500 dark:text-ink-400 mt-0.5">
                  Change your password
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#a8aebc" />
            </Pressable>
          </View>
        </View>

        {/* ── App Info box ── */}
        <View className="mb-6 bg-ink-50 dark:bg-ink-800/50 rounded-2xl border border-ink-100 dark:border-ink-800 p-4">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
              <Ionicons name="information-circle" size={18} color="#a8aebc" />
              <Text className="text-xs font-bold text-ink-700 dark:text-ink-300 ml-2">
                About SyncPulse
              </Text>
            </View>
            <View className="bg-white dark:bg-ink-700 px-2.5 py-1 rounded-full shadow-sm">
              <Text className="text-[10px] font-bold text-ink-500 dark:text-ink-300">
                v{version}
              </Text>
            </View>
          </View>
          <Text className="text-[10px] font-medium text-ink-500 dark:text-ink-400 leading-4 mt-1.5">
            Your daily check-in and check-out management system. Keep track of all your progress efficiently.
          </Text>
        </View>

        {/* ── Actions ── */}
        <View className="gap-3">
          <Pressable
            onPress={logout}
            className="flex-row items-center justify-center py-3.5 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl active:bg-ink-50 dark:active:bg-ink-800"
          >
            <Ionicons name="log-out-outline" size={18} color="#c45c3e" />
            <Text className="text-clay dark:text-clay-muted text-sm font-bold ml-2">
              Log Out
            </Text>
          </Pressable>

          <Pressable
            onPress={handleDeleteAccount}
            className="flex-row items-center justify-center py-3.5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl active:bg-red-100 dark:active:bg-red-900/20"
          >
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
            <Text className="text-red-500 dark:text-red-400 text-sm font-bold ml-2">
              Delete Account
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ── Edit Profile Modal ── */}
      <Modal
        visible={ui.isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => updateUI("isEditModalVisible", false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-white dark:bg-ink-900 rounded-t-[28px] p-5 h-[75%] shadow-2xl">
            {/* Handle bar */}
            <View className="items-center mb-4">
              <View className="h-1.5 w-10 bg-ink-200 dark:bg-ink-700 rounded-full" />
            </View>

            {/* Modal header */}
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-extrabold text-ink-900 dark:text-ink-50 tracking-tight">
                Edit Profile
              </Text>
              <Pressable
                onPress={() => updateUI("isEditModalVisible", false)}
                className="w-8 h-8 items-center justify-center rounded-full bg-ink-50 dark:bg-ink-800 active:bg-ink-100 dark:active:bg-ink-700"
              >
                <Ionicons name="close" size={20} color="#a8aebc" />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {/* Full Name */}
              <View className="mb-4">
                <Text className="text-[10px] font-bold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-2 ml-1">
                  Full Name
                </Text>
                <TextInput
                  value={form.name}
                  onChangeText={(v) => updateForm("name", v)}
                  placeholder="E.g. John Doe"
                  placeholderTextColor="#a8aebc"
                  className="bg-ink-50 dark:bg-ink-800 border border-ink-100 dark:border-ink-800 rounded-2xl px-4 py-3.5 text-sm font-medium text-ink-900 dark:text-ink-50"
                />
              </View>

              {/* Role */}
              <View className="mb-4">
                <Text className="text-[10px] font-bold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-2 ml-1">
                  Role / Position
                </Text>
                <TextInput
                  value={form.role}
                  onChangeText={(v) => updateForm("role", v)}
                  placeholder="E.g. Developer"
                  placeholderTextColor="#a8aebc"
                  className="bg-ink-50 dark:bg-ink-800 border border-ink-100 dark:border-ink-800 rounded-2xl px-4 py-3.5 text-sm font-medium text-ink-900 dark:text-ink-50"
                />
              </View>

              {/* Email */}
              <View className="mb-6">
                <Text className="text-[10px] font-bold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-2 ml-1">
                  Email Address
                </Text>
                <TextInput
                  value={form.email}
                  onChangeText={(v) => updateForm("email", v)}
                  keyboardType="email-address"
                  placeholder="E.g. johndoe@example.com"
                  placeholderTextColor="#a8aebc"
                  className="bg-ink-50 dark:bg-ink-800 border border-ink-100 dark:border-ink-800 rounded-2xl px-4 py-3.5 text-sm font-medium text-ink-900 dark:text-ink-50"
                />
              </View>

              {/* Save button */}
              <Pressable
                onPress={handleSave}
                style={{ backgroundColor: "#c45c3e" }}
                className="rounded-2xl py-3.5 items-center shadow-sm active:opacity-80"
              >
                <Text className="text-white text-base font-bold tracking-wide">
                  Save Changes
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

