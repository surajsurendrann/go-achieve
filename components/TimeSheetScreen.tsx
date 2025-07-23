import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo, useState } from "react";
import {
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const baseURL = "http://agilescrummodel.com:3000";

const getDateRange = (option: string) => {
  const now = new Date();

  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  firstDayOfMonth.setHours(12, 0, 0, 0);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  lastDayOfMonth.setHours(12, 0, 0, 0);

  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  lastMonthStart.setHours(12, 0, 0, 0);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  lastMonthEnd.setHours(12, 0, 0, 0);

  switch (option) {
    case "this_month":
      return {
        from: firstDayOfMonth.toISOString().slice(0, 10),
        to: lastDayOfMonth.toISOString().slice(0, 10),
      };
    case "last_month":
      return {
        from: lastMonthStart.toISOString().slice(0, 10),
        to: lastMonthEnd.toISOString().slice(0, 10),
      };
    default:
      return { from: "", to: "" };
  }
};

export default function TimesheetScreen() {
  const [filter, setFilter] = useState("this_month");
  const [customFrom, setCustomFrom] = useState<Date | null>(null);
  const [customTo, setCustomTo] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<"from" | "to" | null>(null);

  const dateParams = useMemo(() => {
    return filter === "custom"
      ? {
          from: customFrom?.toISOString().split("T")[0],
          to: customTo?.toISOString().split("T")[0],
        }
      : getDateRange(filter);
  }, [filter, customFrom, customTo]);

  const {
    data = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["timesheet", filter, dateParams],
    queryFn: async () => {
      const key = await AsyncStorage.getItem("apiKey");
      if (!key) throw new Error("Missing API key");

      const { from, to } = dateParams;
      if (!from || !to) throw new Error("Invalid date range");

      const res = await axios.get(
        `${baseURL}/time_entries.json?user_id=me&key=${key}&from=${from}&to=${to}`
      );
      return res.data.time_entries || [];
    },
    enabled: !!dateParams.from && !!dateParams.to,
    networkMode: "online",
  });

  return (
    <SafeAreaView className="flex-1 bg-light">
      <View className="flex-1">
        {/* <Text className="text-2xl font-bold">Timesheet</Text> */}
        {/* Filter Buttons */}
        <View className="flex-row my-3 px-4 gap-2 flex-wrap">
          {["this_month", "last_month", "custom"].map((key) => (
            <TouchableOpacity
              key={key}
              className={`px-3 py-2 rounded-lg shadow-sm ${
                filter === key ? "bg-secondary" : "bg-white"
              }`}
              onPress={() => {
                setFilter(key);
                setShowPicker(null);
              }}
            >
              <Text
                className={`text-sm ${
                  filter === key ? "text-white" : "text-black"
                }`}
              >
                {key.replace("_", " ").toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Date Pickers */}
        {filter === "custom" && (
          <View className="mb-4 px-4 gap-2">
            <TouchableOpacity
              onPress={() => setShowPicker("from")}
              className="border border-primary p-3 rounded-lg"
            >
              <Text>
                From: {customFrom ? customFrom.toDateString() : "Pick a date"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowPicker("to")}
              className="border border-primary p-3 rounded-lg"
            >
              <Text>
                To: {customTo ? customTo.toDateString() : "Pick a date"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {showPicker && (
          <DateTimePicker
            value={
              showPicker === "from"
                ? customFrom || new Date()
                : customTo || new Date()
            }
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              // Only update if user confirmed (Android)
              if (Platform.OS === "android") {
                if (event.type === "set" && selectedDate) {
                  if (showPicker === "from") setCustomFrom(selectedDate);
                  else setCustomTo(selectedDate);
                }
                setShowPicker(null); // Close after confirmation
              } else {
                // iOS fires continuously
                if (selectedDate) {
                  if (showPicker === "from") setCustomFrom(selectedDate);
                  else setCustomTo(selectedDate);
                }
              }
            }}
          />
        )}

        {/* Entries Scrollable List */}
        <ScrollView
          className="flex-1 p-4"
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        >
          {error ? (
            <Text className="text-center text-red-500 mt-10">
              Failed to load entries.
            </Text>
          ) : data.length === 0 ? (
            <Text className="text-center text-gray-500 mt-10">
              No entries found.
            </Text>
          ) : (
            data.map((entry: any) => (
              <View
                key={entry.id}
                className="mb-4 p-4 bg-white shadow-sm rounded-lg"
              >
                <Text className="text-base font-semibold text-gray-800">
                  {entry.project?.name || "No Project"} — {entry.hours} hrs
                </Text>
                <Text className="text-sm text-gray-600">
                  Date: {entry.spent_on}
                </Text>
                {entry.issue && (
                  <Text className="text-sm text-gray-600">
                    Issue: #{entry.issue.id}
                  </Text>
                )}
                {entry.comments && (
                  <Text className="text-sm text-gray-800 mt-1">
                    “{entry.comments}”
                  </Text>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
