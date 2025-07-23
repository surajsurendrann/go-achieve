import { HeaderTitle } from "@/components/HeaderTitle";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        animation: "shift",
        tabBarActiveTintColor: "#1B3C53",
        headerShown: true, // Enable header
        headerTitleAlign: "left",
        headerShadowVisible: false,
        headerTitle: () => <HeaderTitle />,
      }}
      backBehavior="order"
      initialRouteName="home"
    >
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="timesheet"
        options={{
          title: "Timesheet",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="book" color={color} />
          ),
        }}
      />

      {/* Hidden from tabs */}
      <Tabs.Screen
        name="timeEntry"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
