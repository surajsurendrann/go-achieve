import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

const ProjectCard = (props: any) => {
  const { project, loadingProjectId, handleProjectPress } = props;
  return (
    <TouchableHighlight
      className="rounded-lg"
      onPress={() => handleProjectPress(props.project)}
      disabled={loadingProjectId === project.id}
    >
      <View className="flex flex-row items-center justify-between bg-white p-8 rounded-lg shadow-sm">
        <View className="flex flex-row items-center gap-3">
          <AntDesign name="book" size={18} color="black" />
          <Text className="font-semibold text-lg">{project?.name}</Text>
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
