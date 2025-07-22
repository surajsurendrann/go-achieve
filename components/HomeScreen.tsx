import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import ProjectCard from "./ProjectCard";

const baseURL = "http://agilescrummodel.com:3000";

export default function HomeScreen() {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingProjectId, setLoadingProjectId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProjects(); // initial load
  }, []);

  const fetchProjects = async (forceRefresh = false) => {
    setLoadingProjects(!forceRefresh); // only show loader if not pull-to-refresh

    try {
      const key = await AsyncStorage.getItem("apiKey");
      if (!key) throw new Error("API key not found");

      // Use cache only if not forced refresh
      if (!forceRefresh) {
        const cached = await AsyncStorage.getItem("projects_cache");
        if (cached) {
          setProjects(JSON.parse(cached));
          setLoadingProjects(false);
        }
      }

      const res = await axios.get(`${baseURL}/projects.json?key=${key}`);
      const freshProjects = res.data.projects || [];

      setProjects(freshProjects);
      await AsyncStorage.setItem(
        "projects_cache",
        JSON.stringify(freshProjects)
      );
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoadingProjects(false);
      setRefreshing(false);
    }
  };

  const handleProjectPress = async (project: any) => {
    const key = await AsyncStorage.getItem("apiKey");
    if (!key) return;

    try {
      setLoadingProjectId(project.id);

      const cacheKey = `issues_${project.identifier}`;
      const cachedIssues = await AsyncStorage.getItem(cacheKey);
      let issues = [];

      if (cachedIssues) {
        issues = JSON.parse(cachedIssues);
      } else {
        const url = `${baseURL}/projects/${project.identifier}/issues.json?key=${key}&set_filter=1&tracker_id=2`;
        const issuesRes = await axios.get(url);
        issues = issuesRes.data.issues || [];
        console.log({ issues });

        await AsyncStorage.setItem(cacheKey, JSON.stringify(issues));
      }

      router.push({
        pathname: "/timeEntry",
        params: {
          id: project.id.toString(),
          identifier: project.identifier,
          issues: JSON.stringify(issues),
        },
      });
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    } finally {
      setLoadingProjectId(null);
    }
  };

  if (loadingProjects) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="blue" />
        <Text className="mt-4 text-gray-500">Loading projects...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-100 p-4">
      {/* <Text className="text-2xl font-bold mb-2">Projects</Text> */}

      <ScrollView
        className="flex-1 p-4  space-y-3"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchProjects(true); // force fresh fetch
            }}
          />
        }
      >
        <View className="flex-1 gap-2">
          {projects.map((project: any) => (
            <ProjectCard
              key={project.id}
              project={project}
              loadingProjectId={loadingProjectId}
              handleProjectPress={handleProjectPress}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
