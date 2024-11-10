// app/_layout.tsx
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        {/* Auth Screens */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Song Detail */}
        <Stack.Screen
          name="songDetail/[id]"
          options={{
            title: "Song Detail",
            headerBackTitle: "Back",
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: "900",
              color: "#0066cc",
            },
            headerTitleAlign: "center",
          }}
        />

        {/* Playlist Detail */}
        <Stack.Screen
          name="playlistDetail/[id]"
          options={{
            title: "Playlist Detail",
            headerBackTitle: "Back",
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: "900",
              color: "#0066cc",
            },
            headerTitleAlign: "center",
          }}
        />

        {/* Artist Detail */}
        <Stack.Screen
          name="artistDetail/[id]"
          options={{
            title: "Artist Detail",
            headerBackTitle: "Back",
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: "900",
              color: "#0066cc",
            },
            headerTitleAlign: "center",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
