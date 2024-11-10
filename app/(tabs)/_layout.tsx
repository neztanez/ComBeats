import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: "home" | "search" | "person" = "home";

          if (route.name === "index") {
            iconName = "home";
          } else if (route.name === "search") {
            iconName = "search";
          } else if (route.name === "profile") {
            iconName = "person";
          }

          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={size + 5} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: "#0066cc", // Warna ikon saat aktif
        tabBarInactiveTintColor: "#808080", // Warna ikon saat tidak aktif
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: false,
        keyboardHidesTabBar: false,
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Homescreen" }} />
      <Tabs.Screen name="search" options={{ title: "Search Music" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: "#f0f8ff",
    borderRadius: 24,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    paddingBottom: 10,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 65,
    height: 65,
  },
});

export default TabsLayout;
