import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, useColorScheme, View } from "react-native";

export const Tile = ({
  label,
  value,
  icon,
  iconColor,
}: {
  label: string;
  value: number | string;
  icon: any;
  iconColor: string;
}) => {
  const colorScheme = useColorScheme();
  return (
    <View
      className={`flex-1 bg-white rounded-lg p-4 gap-2 shadow-sm justify-around ${colorScheme === "light" ? "bg-light" : "bg-darkContainer"}`}
    >
      <View className="flex flex-row gap-2 items-center">
        <FontAwesome name={icon} size={20} color={iconColor} />
        <Text className="text-gray-600">{label}</Text>
      </View>
      {Number(value) ? (
        <View className="flex flex-row items-baseline">
          <Text
            className={`text-4xl  ${colorScheme === "light" ? "color-dark" : "color-white"}`}
          >
            {value}
          </Text>
          <Text
            className={`text-gray-600 font-semibold text-lg text-center  ${colorScheme === "light" ? "color-dark" : "color-white"}`}
          >
            Hrs
          </Text>
        </View>
      ) : (
        <Text
          className={`text-4xl  ${colorScheme === "light" ? "color-dark" : "color-white"}`}
        >
          {value}
        </Text>
      )}
    </View>
  );
};
