import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

type Song = {
  id: string;
  title: string;
  artist: string;
  cover: string;
};

const favoriteSongs: Song[] = [
  {
    id: "1",
    title: "Risalah Hati",
    artist: "Dewa 19",
    cover: "https://api.deezer.com/artist/5551146/image",
  },
  {
    id: "2",
    title: "Stand By Me",
    artist: "Oasis",
    cover:
      "https://e-cdns-images.dzcdn.net/images/artist/bafbda4f8507af52be228cfe08d3b460/500x500-000000-80-0-0.jpg",
  },
  {
    id: "3",
    title: "Wonderwall (Remastered)",
    artist: "Oasis",
    cover:
      "https://e-cdns-images.dzcdn.net/images/artist/bafbda4f8507af52be228cfe08d3b460/500x500-000000-80-0-0.jpg",
  },
  {
    id: "4",
    title: "Cucak Rowo",
    artist: "Didi Kempot",
    cover:
      "https://e-cdns-images.dzcdn.net/images/artist/69825b4396ce49338ccdbfb21297e2c5/500x500-000000-80-0-0.jpg",
  },
];

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "Permission to access gallery is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/(auth)/landing"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Pengaturan Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor="#f0f8ff" />

      {/* Header dengan foto profil dan username */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : {
                    uri: "https://media.licdn.com/dms/image/v2/D5603AQEfaCpKyFsQrA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1720511547417?e=1736380800&v=beta&t=mOSoIramgZ3sW3dYXBjPQVs-L47Z7D_27i1wuMFkeNQ",
                  }
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.username}>Nezta</Text>
      </View>

      {/* Informasi User */}
      <View style={styles.infoContainer}>
        {/* Email and Logout aligned horizontally */}
        <View style={styles.emailContainer}>
          <View style={styles.emailInfo}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoText}>aneznezta@gmail.com</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Member Since:</Text>
        <Text style={styles.infoText}>January 2022</Text>
      </View>

      {/* Favorite Songs Section */}
      <Text style={styles.sectionHeader}>Favorite Songs</Text>
      <FlatList
        data={favoriteSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.songContainer}>
            <Image source={{ uri: item.cover }} style={styles.cover} />
            <View style={styles.songInfo}>
              <Text style={styles.songTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.artistName} numberOfLines={1}>
                {item.artist}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.favoriteSongsList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    padding: 20,
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 20,
    gap: 10,
  },
  profileImage: {
    width: 120, // Ukuran gambar tetap
    height: 120, // Membuatnya persegi
    borderRadius: 60, // Setengah dari ukuran untuk membuat lingkaran
    backgroundColor: "#ffffff",
    alignContent: "center",
    justifyContent: "center",
  },
  username: {
    justifyContent: "center",
    fontSize: 24,
    fontWeight: "800",
    color: "#0066cc",
  },
  infoContainer: {
    marginBottom: 15,
    marginHorizontal: 20,
  },
  emailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emailInfo: {
    flex: 1,
    marginRight: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0066cc",
  },
  infoText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
    marginTop: 5,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0066cc",
    marginTop: 5,
    marginHorizontal: 20,
    marginBottom: 10,
    textAlign: "left",
  },
  favoriteSongsList: {
    paddingBottom: 10,
  },
  songContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 10,
  },
  cover: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: "#ffffff",
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0066cc",
  },
  artistName: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: "#cc0000",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
