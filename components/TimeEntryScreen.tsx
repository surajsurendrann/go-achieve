import { activityOptions } from "@/utils/contants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import qs from "qs";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const baseURL = "http://agilescrummodel.com:3000";

export default function TimeEntryScreen() {
  const { issues } = useLocalSearchParams<{
    issues: string;
    identifier: string;
  }>();

  const parsedIssues = issues ? JSON.parse(issues) : [];

  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [hours, setHours] = useState<string>("8");
  const [comments, setComments] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [issueDropdownOpen, setIssueDropdownOpen] = useState(false);
  const [activityId, setActivityId] = useState<string>("23"); // Dev Code
  const [activityDropdownOpen, setActivityDropdownOpen] = useState(false);

  const handleSubmit = async () => {
    const key = await AsyncStorage.getItem("apiKey");
    if (!selectedIssueId || !hours || !activityId) {
      Alert.alert("Validation", "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    const time_entry = {
      issue_id: selectedIssueId,
      spent_on: date.toISOString().split("T")[0],
      hours: parseFloat(hours),
      activity_id: activityId,
      comments,
    };

    console.log(time_entry);

    try {
      await axios.post(
        `${baseURL}/time_entries.json?key=${key}`,
        qs.stringify({
          utf8: "✓",
          time_entry: {
            issue_id: selectedIssueId,
            spent_on: date.toISOString().split("T")[0],
            hours: parseFloat(hours),
            activity_id: activityId,
            comments,
          },
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      Alert.alert("Success", "Time entry submitted successfully.");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to submit time entry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1  p-4">
        <Text className="text-xl font-bold mb-6">Log Time</Text>

        <Text className="text-sm mb-1 font-semibold">Select Issue</Text>
        <TouchableOpacity
          onPress={() => setIssueDropdownOpen(!issueDropdownOpen)}
          className="p-3 border border-gray-300 rounded-lg mb-2 bg-gray-50"
        >
          <Text>
            {selectedIssueId
              ? parsedIssues.find((i: any) => i.id === selectedIssueId)?.subject
              : "Choose an issue"}
          </Text>
        </TouchableOpacity>

        {issueDropdownOpen &&
          parsedIssues.map((issue: any) => (
            <TouchableOpacity
              key={issue.id}
              onPress={() => {
                setSelectedIssueId(issue.id);
                setIssueDropdownOpen(false);
              }}
              className={`p-3 border-b border-gray-200 ${
                selectedIssueId === issue.id ? "bg-blue-100" : "bg-white"
              }`}
            >
              <Text>{issue.subject}</Text>
            </TouchableOpacity>
          ))}

        <Text className="text-sm mb-1 font-semibold mt-4">Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="p-3 border border-gray-300 rounded-lg mb-4"
        >
          <Text>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="inline"
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <Text className="text-sm mb-1 font-semibold">Hours</Text>
        <TextInput
          placeholder="Hours"
          value={hours}
          onChangeText={setHours}
          keyboardType="decimal-pad"
          className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
        />

        <Text className="text-sm mb-1 font-semibold">Comment</Text>
        <TextInput
          placeholder="Comment"
          value={comments}
          onChangeText={setComments}
          className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
        />

        <Text className="text-sm mb-1 font-semibold">Activity</Text>
        <TouchableOpacity
          onPress={() => setActivityDropdownOpen(!activityDropdownOpen)}
          className="p-3 border border-gray-300 rounded-lg mb-2 bg-gray-50"
        >
          <Text>
            {activityOptions.find((a) => String(a.id) === String(activityId))
              ?.label || "Choose an activity"}
          </Text>
        </TouchableOpacity>

        {activityDropdownOpen &&
          activityOptions.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              onPress={() => {
                setActivityId(String(activity.id));
                setActivityDropdownOpen(false);
              }}
              className={`p-3 border-b border-gray-200 ${
                String(activityId) === String(activity.id)
                  ? "bg-blue-100"
                  : "bg-white"
              }`}
            >
              <Text>{activity.label}</Text>
            </TouchableOpacity>
          ))}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting}
          className="bg-secondary py-3 rounded-lg"
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Submit
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
