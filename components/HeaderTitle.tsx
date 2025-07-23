import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, useColorScheme, View } from "react-native";

export const HeaderTitle = () => {
  const colorScheme = useColorScheme();
  return (
    <View className={`flex flex-row gap-1 items-center `}>
      <MaterialCommunityIcons name="lighthouse" size={20} color="#456882" />
      <Text className={`text-secondary text-lg font-bold ${colorScheme === 'light' ? 'text-secondary': '' }`}>Go Achieve</Text>
    </View>
  );
};
