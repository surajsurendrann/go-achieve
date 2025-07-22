import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const LoginScreen = () => {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  const baseURL = "http://agilescrummodel.com:3000";

  useEffect(() => {
    const checkStoredApiKey = async () => {
      const savedKey = await AsyncStorage.getItem("apiKey");
      if (savedKey) {
        setApiKey(savedKey);
        validateApiKey(savedKey, true);
      }
    };
    checkStoredApiKey();
  }, []);

  const validateApiKey = async (key: any, silent = false) => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/users/current.json?key=${key}`);
      if (res.status === 200 && res.data.user) {
        await AsyncStorage.setItem("apiKey", key);
        if (!silent) router.replace("/home");
      } else {
        Alert.alert("Login Failed", "Invalid API key.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Failed to connect to Achieve");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!apiKey) {
      Alert.alert("Missing Input", "Please enter your Achieve API key.");
      return;
    }
    await validateApiKey(apiKey);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 justify-center bg-white px-8">
        <View className="flex flex-col justify-center items-center gap-5 mb-6">
          <MaterialCommunityIcons name="lighthouse" size={55} color="#456882" />
          <Text className="text-3xl font-bold text-center color-secondary">
            Go Achieve
          </Text>
        </View>

        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="API Key"
          value={apiKey}
          onChangeText={setApiKey}
          autoCapitalize="none"
          placeholderTextColor="#A0AEC0"
          editable={!loading}
        />

        <TouchableOpacity
          className={`bg-primary py-3 rounded-lg ${loading ? "opacity-50" : ""}`}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Log In
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
