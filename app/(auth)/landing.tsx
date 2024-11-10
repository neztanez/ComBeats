// app/(auth)/landing.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";

const LandingPage: React.FC = () => {
  const router = useRouter();

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>
          Welcome to {"\n"}
          <Text style={{ color: "#0066cc", fontWeight: "800", fontSize: 28 }}>
            {" "}
            ComBeats
          </Text>
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <Text style={styles.nama}>Nezta Misgi Febyandanu</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 30,
    paddingVertical: 50,
    width: "80%",
    height: "40%",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  button: {
    backgroundColor: "#0066cc",
    paddingVertical: 15,
    width: "100%",
    paddingHorizontal: 60,
    borderRadius: 12,
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#0066cc",
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  nama: {
    position: "absolute",
    bottom: 20,
    color: "#666",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default LandingPage;
