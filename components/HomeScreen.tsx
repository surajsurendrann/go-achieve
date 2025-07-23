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
import { Tile } from "./Tile";

const baseURL = "http://agilescrummodel.com:3000";
export default function HomeScreen() {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingProjectId, setLoadingProjectId] = useState<number | null>(null);
  const router = useRouter();
  const [currentMonthTotalHours, setCurrentMonthTotalHours] = useState(0);
  const [lastLoggedDate, setLastLoggedDate] = useState("");

  useEffect(() => {
    fetchProjects(); // initial load
  }, []);

  const getTotalHoursCurrentMonth = async () => {
    try {
      const key = await AsyncStorage.getItem("apiKey");
      if (!key) throw new Error("Missing API key");

      // Get current month date range
      const now = new Date();

      const fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      fromDate.setHours(12); // Prevent UTC shift
      const from = fromDate.toISOString().split("T")[0];

      const toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      toDate.setHours(12);
      const to = toDate.toISOString().split("T")[0];

      // Fetch time entries from Redmine API
      const response = await axios.get(
        `${baseURL}/time_entries.json?key=${key}&user_id=me&from=${from}&to=${to}&limit=100`
      );

      const entries = response.data.time_entries || [];

      // Sum total hours
      const total = entries.reduce(
        (sum: number, entry: any) => sum + entry.hours,
        0
      );
      setCurrentMonthTotalHours(total);

      const createdOn = entries[0].created_on;
      if (createdOn) {
        const date = new Date(createdOn).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        setLastLoggedDate(date);
      }
    } catch (error) {
      console.error("Error fetching total hours:", error);
      setCurrentMonthTotalHours(0);
      setLastLoggedDate("");
    }
  };

  useEffect(() => {
    getTotalHoursCurrentMonth();
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
    <SafeAreaView className={`flex-1`}>
      <ScrollView
        className="flex-1"
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
        <View className="flex-1 gap-3 p-4">
          <View className="flex-1 flex-row gap-2 justify-between">
            <Tile
              label={"Total hours logged"}
              value={currentMonthTotalHours}
              icon={"hourglass-half"}
              iconColor="green"
            />
            <Tile
              label={"Last logged date"}
              value={lastLoggedDate}
              icon={"calendar"}
              iconColor="blue"
            />
          </View>
          <View className="flex-1 gap-2 mt-2">
            <Text className="text-xl font-bold mb-2 color-secondary">Projects</Text>
            {projects.map((project: any) => (
              <ProjectCard
                key={project.id}
                project={project}
                loadingProjectId={loadingProjectId}
                handleProjectPress={handleProjectPress}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
