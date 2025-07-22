import LoginScreen from "@/components/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import "./global.css";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const apiKey = await AsyncStorage.getItem("apiKey");
      if (apiKey) {
        router.replace("/home");
      }
    };
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className="flex-1 bg-white">
      <LoginScreen />
    </View>
  );
}
