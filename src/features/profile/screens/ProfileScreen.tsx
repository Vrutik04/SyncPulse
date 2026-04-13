import { ScreenContainer } from "@/shared/components/ScreenContainer";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import { computeStreak } from "@/lib/stats";
import { useZustandStore } from "@/store/useZustandStore";

// App version
const version =
  Constants.expoConfig?.version ??
  Constants.expoConfig?.runtimeVersion?.toString() ??
  "—";

// Types
type FormState = {
  name: string;
  position: string;
  email: string;
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
  const { entries, userProfile, updateUserProfile } = useZustandStore();

  const streak = computeStreak(entries);
  const totalCheckins = Object.values(entries).filter((e) => e.Checkin).length;

  // State
  const [form, setForm] = useState<FormState>({
    name: userProfile.name,
    position: userProfile.position,
    email: userProfile.email,
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

  const isValid = form.name.trim().length > 0 && form.email.includes("@");

  const handleSave = () => {
    updateUserProfile({
      name: form.name,
      position: form.position,
      email: form.email,
    });
    updateUI("isEditModalVisible", false);
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateUserProfile({ ProfilePhoto: result.assets[0].uri });
    }
  };

  const openEditModal = () => {
    setForm({
      name: userProfile.name,
      position: userProfile.position,
      email: userProfile.email,
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
        <View className="mb-6 items-center px-4 pt-6 pb-8 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-3xl shadow-sm">
          {/* Avatar */}
          <Pressable onPress={handlePickImage} className="relative">
            <View className="h-28 w-28 rounded-full bg-clay/10 dark:bg-clay/20 items-center justify-center border-4 border-clay/30 dark:border-clay/40 overflow-hidden">
              {userProfile.ProfilePhoto ? (
                <Image
                  source={{ uri: userProfile.ProfilePhoto }}
                  className="w-full h-full"
                />
              ) : (
                <Ionicons name="person" size={56} color="#c45c3e" />
              )}
            </View>
            <View
              style={{ backgroundColor: "#c45c3e" }}
              className="absolute bottom-1 right-1 h-9 w-9 rounded-full items-center justify-center border-2 border-white dark:border-ink-900"
            >
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </Pressable>

          {/* Name & role */}
          <Text className="mt-4 text-2xl font-bold text-ink-900 dark:text-ink-50">
            {userProfile.name}
          </Text>
          {userProfile.position ? (
            <View className="bg-clay/10 dark:bg-clay/20 px-4 py-1.5 rounded-full mt-2 border border-clay/30 dark:border-clay/40">
              <Text className="text-xs font-bold text-clay dark:text-clay-muted tracking-widest uppercase">
                {userProfile.position}
              </Text>
            </View>
          ) : null}
          <Text className="mt-2 text-sm text-ink-400 dark:text-ink-500">
            {userProfile.email}
          </Text>
        </View>

        {/* ── Stats row ── */}
        <View className="mb-6 flex-row gap-3">
          {/* Streak */}
          <View className="flex-1 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-3xl p-5 shadow-sm items-center">
            <View className="h-12 w-12 rounded-full bg-clay/10 dark:bg-clay/20 items-center justify-center mb-3">
              <Ionicons name="flame" size={24} color="#c45c3e" />
            </View>
            <Text className="text-2xl font-bold text-ink-900 dark:text-ink-50">
              {streak}
            </Text>
            <Text className="text-xs font-medium text-ink-400 dark:text-ink-500 mt-1 uppercase tracking-wider">
              Day Streak
            </Text>
          </View>

          {/* Check-ins */}
          <View className="flex-1 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-3xl p-5 shadow-sm items-center">
            <View className="h-12 w-12 rounded-full bg-green-50 dark:bg-green-900/30 items-center justify-center mb-3 border border-green-100 dark:border-green-800">
              <Ionicons name="checkmark-done" size={24} color="#16a34a" />
            </View>
            <Text className="text-2xl font-bold text-ink-900 dark:text-ink-50">
              {totalCheckins}
            </Text>
            <Text className="text-xs font-medium text-ink-400 dark:text-ink-500 mt-1 uppercase tracking-wider">
              Check-ins
            </Text>
          </View>
        </View>

        {/* ── Settings menu ── */}
        <View className="mb-6 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-3xl p-2 shadow-sm">
          {/* Edit Profile */}
          <Pressable
            onPress={openEditModal}
            className="flex-row items-center p-3 border-b border-ink-100 dark:border-ink-800"
          >
            <View className="w-12 h-12 rounded-full bg-clay/10 dark:bg-clay/20 items-center justify-center mr-4">
              <Ionicons name="person-outline" size={22} color="#c45c3e" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-ink-900 dark:text-ink-50">
                Edit Profile
              </Text>
              <Text className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
                Update personal details
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#a8aebc" />
          </Pressable>

          {/* Notifications */}
          <Pressable className="flex-row items-center p-3 border-b border-ink-100 dark:border-ink-800">
            <View className="w-12 h-12 rounded-full bg-clay/10 dark:bg-clay/20 items-center justify-center mr-4">
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#c45c3e"
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-ink-900 dark:text-ink-50">
                Notifications
              </Text>
              <Text className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
                Manage reminder alerts
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#a8aebc" />
          </Pressable>

          {/* Security */}
          <Pressable className="flex-row items-center p-3">
            <View className="w-12 h-12 rounded-full bg-clay/10 dark:bg-clay/20 items-center justify-center mr-4">
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#c45c3e"
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-ink-900 dark:text-ink-50">
                Security
              </Text>
              <Text className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
                Change your password
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#a8aebc" />
          </Pressable>
        </View>

        {/* ── App Info box ── */}
        <View className="rounded-3xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 p-6 shadow-sm">
          <View className="flex-row items-center mb-3">
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#a8aebc"
            />
            <Text className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest ml-2">
              App Info
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold text-ink-900 dark:text-ink-50">
              SyncPulse
            </Text>
            <View className="bg-white dark:bg-ink-700 border border-ink-200 dark:border-ink-600 px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-ink-500 dark:text-ink-300">
                v{version}
              </Text>
            </View>
          </View>
          <Text className="text-sm text-ink-400 dark:text-ink-500 leading-5">
            Your daily check-in and check-out management system. Keep track of
            all your daily progress in one beautiful place.
          </Text>
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
          <View className="bg-white dark:bg-ink-900 rounded-t-3xl p-6 h-[80%] shadow-lg">
            {/* Modal header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-ink-900 dark:text-ink-50">
                Edit Profile
              </Text>
              <Pressable
                onPress={() => updateUI("isEditModalVisible", false)}
                className="w-9 h-9 items-center justify-center rounded-full bg-ink-100 dark:bg-ink-800"
              >
                <Ionicons name="close" size={20} color="#606882" />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* Full Name */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-2">
                  Full Name
                </Text>
                <TextInput
                  value={form.name}
                  onChangeText={(v) => updateForm("name", v)}
                  placeholder="E.g. John Doe"
                  placeholderTextColor="#a8aebc"
                  className="bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-2xl px-4 py-3 text-base text-ink-900 dark:text-ink-50"
                />
              </View>

              {/* Position */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-2">
                  Position / Role
                </Text>
                <TextInput
                  value={form.position}
                  onChangeText={(v) => updateForm("position", v)}
                  placeholder="E.g. Senior Developer"
                  placeholderTextColor="#a8aebc"
                  className="bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-2xl px-4 py-3 text-base text-ink-900 dark:text-ink-50"
                />
              </View>

              {/* Email */}
              <View className="mb-8">
                <Text className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-2">
                  Email Address
                </Text>
                <TextInput
                  value={form.email}
                  onChangeText={(v) => updateForm("email", v)}
                  keyboardType="email-address"
                  placeholder="E.g. johndoe@example.com"
                  placeholderTextColor="#a8aebc"
                  className="bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-2xl px-4 py-3 text-base text-ink-900 dark:text-ink-50"
                />
              </View>

              {/* Save button */}
              <Pressable
                onPress={handleSave}
                style={{ backgroundColor: "#c45c3e" }}
                className="rounded-2xl py-4 items-center"
              >
                <Text className="text-white text-base font-bold">
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
