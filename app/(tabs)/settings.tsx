import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("apiKey");
          router.replace("/");
        },
      },
    ]);
  };

  const getApiKey = async () => {
    const key = await AsyncStorage.getItem("apiKey");
    if (key) setApiKey(key);
  };

  useEffect(() => {
    getApiKey();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-light">
      <View className="flex-1 p-4 justify-between">
        <View>
          {/* <Text className="text-2xl font-bold mb-4">Settings</Text> */}

          <View className="flex  bg-white p-2 rounded-lg shadow-sm divide-y-2">
            {/* Dark Mode Option */}
            {/* <TouchableOpacity
              onPress={() => null}
              className="flex-row items-center rounded-lg mb-2"
            >
              <MaterialCommunityIcons
                name="theme-light-dark"
                size={20}
                color="#1B3C53"
                style={{ marginRight: 12 }}
              />
              <Text className="font-semibold text-lg">Dark Mode</Text>
            </TouchableOpacity> */}
            {/* Divider */}
            {/* <View className="h-px bg-gray-200 my-2 mx-5"/> */}
            {/* Logout */}
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center rounded-lg my-1"
            >
              <Feather
                name="log-out"
                size={20}
                color="#1B3C53"
                style={{ marginRight: 12 }}
              />
              <Text className="font-semibold text-lg">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-sm text-gray-400 text-center">
          API Key: {apiKey}
        </Text>
      </View>
    </SafeAreaView>
  );
}
