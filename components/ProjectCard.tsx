import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableHighlight,
  useColorScheme,
  View,
} from "react-native";

const ProjectCard = (props: any) => {
  const colorScheme = useColorScheme();
  const { project, loadingProjectId, handleProjectPress } = props;
  return (
    <TouchableHighlight
      className="rounded-lg"
      onPress={() => handleProjectPress(props.project)}
      disabled={loadingProjectId === project.id}
    >
      <View
        className={`flex flex-row items-center justify-between ${colorScheme === "light" ? "bg-white" : "bg-darkContainer"} p-8 rounded-lg shadow-sm`}
      >
        <View className="flex flex-row items-center gap-5">
          <AntDesign
            name="book"
            size={25}
            color={`${colorScheme === "light" ? "red" : "white"}`}
          />
          <View className="gap-1">
            <Text
              className={`font-semibold text-xl  ${colorScheme === "light" ? "color-dark" : "color-white"}`}
            >
              {project?.name}
            </Text>
            <Text
              className={`text-gray-400 text-sm  ${colorScheme === "light" ? "color-dark" : "color-white"}`}
            >
             Created on {new Date(project?.created_on).toLocaleDateString()}

            </Text>
          </View>
        </View>
        {loadingProjectId === project.id ? (
          <ActivityIndicator color="black" />
        ) : (
          <MaterialIcons name="arrow-forward-ios" size={18} color="gray" />
        )}
      </View>
    </TouchableHighlight>
  );
};

export default ProjectCard;
