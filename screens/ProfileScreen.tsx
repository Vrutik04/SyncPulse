import { ScreenContainer } from "@/components/ScreenContainer";
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

// Get app version 
const version =
  Constants.expoConfig?.version ??
  Constants.expoConfig?.runtimeVersion?.toString() ??
  "—";

export const ProfileScreen = () => {
  const { entries, userProfile, updateUserProfile } = useZustandStore();

  const streak = computeStreak(entries);
  const totalCheckins = Object.values(entries).filter((e) => e.morning).length;

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editPosition, setEditPosition] = useState(userProfile.position);
  const [editEmail, setEditEmail] = useState(userProfile.email);

  const handleSave = () => {
    updateUserProfile({
      name: editName,
      position: editPosition,
      email: editEmail,
    });
    setEditModalVisible(false);
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera is  required!");
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

  return (
    <ScreenContainer title="Profile" subtitle="Your account details">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* User Card */}
        <View className="mb-6 items-center px-4 pt-6 pb-8 bg-white border border-gray-200 rounded-3xl shadow-sm">
          {/* Avatar Container */}
          <Pressable onPress={handlePickImage} className="relative">
            <View className="h-28 w-28 rounded-full bg-orange-50 items-center justify-center border-4 border-orange-100 shadow-sm overflow-hidden">
              {userProfile.ProfilePhoto ? (
                <Image
                  source={{ uri: userProfile.ProfilePhoto }}
                  className="w-full h-full"
                />
              ) : (
                <Ionicons name="person" size={56} color="#ea580c" />
              )}
            </View>
            <View className="absolute bottom-1 right-1 bg-orange-600 h-9 w-9 rounded-full items-center justify-center border-2 border-white">
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </Pressable>

          {/* User Info */}
          <Text className="mt-4 text-2xl font-bold text-gray-800">
            {userProfile.name}
          </Text>
          {userProfile.position ? (
            <View className="bg-orange-50 px-4 py-1.5 rounded-full mt-2 border border-orange-100">
              <Text className="text-xs font-bold text-orange-600 tracking-widest uppercase">
                {userProfile.position}
              </Text>
            </View>
          ) : null}
          <Text className="mt-2 text-sm text-gray-500">
            {userProfile.email}
          </Text>
        </View>

        {/* Personal Stats */}
        <View className="mb-6 flex-row gap-3">
          <View className="flex-1 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm items-center">
            <View className="h-12 w-12 rounded-full bg-orange-50 items-center justify-center mb-3">
              <Ionicons name="flame" size={24} color="#ea580c" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">{streak}</Text>
            <Text className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider">
              Day Streak
            </Text>
          </View>

          <View className="flex-1 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm items-center">
            <View className="h-12 w-12 rounded-full bg-green-50 items-center justify-center mb-3 border border-green-100">
              <Ionicons name="checkmark-done" size={24} color="#16a34a" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">
              {totalCheckins}
            </Text>
            <Text className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider">
              Check-ins
            </Text>
          </View>
        </View>

        {/* Settings options list */}
        <View className="mb-6 bg-white border border-gray-200 rounded-3xl p-2 shadow-sm">
          {/* Edit Profile */}
          <Pressable
            onPress={() => {
              setEditName(userProfile.name);
              setEditPosition(userProfile.position);
              setEditEmail(userProfile.email);
              setEditModalVisible(true);
            }}
            className="flex-row items-center p-3 border-b border-gray-100"
          >
            <View className="w-12 h-12 rounded-full bg-orange-50 items-center justify-center mr-4">
              <Ionicons name="person-outline" size={22} color="#ea580c" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800">
                Edit Profile
              </Text>
              <Text className="text-xs text-gray-400 mt-0.5">
                Update personal details
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>

          {/* Notifications */}
          <Pressable className="flex-row items-center p-3 border-b border-gray-100">
            <View className="w-12 h-12 rounded-full bg-orange-50 items-center justify-center mr-4">
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#ea580c"
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800">
                Notifications
              </Text>
              <Text className="text-xs text-gray-400 mt-0.5">
                Manage reminder alerts
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>

          {/* Security */}
          <Pressable className="flex-row items-center p-3">
            <View className="w-12 h-12 rounded-full bg-orange-50 items-center justify-center mr-4">
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#ea580c"
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800">
                Security
              </Text>
              <Text className="text-xs text-gray-400 mt-0.5">
                Change your password
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>
        </View>

        {/* App Info Box */}
        <View className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
          <View className="flex-row items-center mb-3">
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#9ca3af"
            />
            <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2">
              App Info
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold text-gray-800">Workspace</Text>
            <View className="bg-white border border-gray-200 px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-gray-500">
                v{version}
              </Text>
            </View>
          </View>
          <Text className="text-sm text-gray-400 leading-5">
            Your daily check-in and check-out management system. Keep track of
            all your daily progress in one beautiful place.
          </Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-[80%] shadow-lg">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800">
                Edit Profile
              </Text>
              <Pressable
                onPress={() => setEditModalVisible(false)}
                className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
              >
                <Ionicons name="close" size={20} color="#4b5563" />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </Text>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="E.g. John Doe"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-base text-gray-800"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Position / Role
                </Text>
                <TextInput
                  value={editPosition}
                  onChangeText={setEditPosition}
                  placeholder="E.g. Senior Developer"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-base text-gray-800"
                />
              </View>

              <View className="mb-8">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </Text>
                <TextInput
                  value={editEmail}
                  onChangeText={setEditEmail}
                  keyboardType="email-address"
                  placeholder="E.g. johndoe@example.com"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-base text-gray-800"
                />
              </View>

              <Pressable
                onPress={handleSave}
                className="bg-orange-600 rounded-2xl py-4 items-center border border-orange-700"
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
