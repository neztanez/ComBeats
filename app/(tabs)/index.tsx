// app/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity, // Tambahkan TouchableOpacity
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router"; // Import useRouter

// Definisikan tipe data dengan benar
type Artist = {
  id: number;
  name: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  link: string;
  radio: boolean;
};

type Album = {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  record_type: string;
  explicit_lyrics: boolean;
  link: string;
};

type Song = {
  id: number;
  title: string;
  artist: Artist;
  album: Album;
  cover: string; // Alias untuk album.cover_medium
  title_version?: string; // Tambahkan jika diperlukan
  duration?: number; // Tambahkan jika diperlukan
  explicit_lyrics?: boolean; // Tambahkan jika diperlukan
  rank?: number; // Tambahkan jika diperlukan
  preview?: string; // Tambahkan jika diperlukan
  readable?: boolean; // Tambahkan jika diperlukan
  link?: string; // Tambahkan jika diperlukan
};

type Playlist = {
  id: number;
  title: string;
  cover: string; // Menggunakan picture_medium
};

const { width } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const router = useRouter(); // Inisialisasi router
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState<boolean>(true);
  const [errorPlaylists, setErrorPlaylists] = useState<string | null>(null);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [loadingArtists, setLoadingArtists] = useState<boolean>(true);
  const [errorArtists, setErrorArtists] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
    fetchPlaylists();
    fetchArtists(); // Tambahkan ini
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get("https://api.deezer.com/chart/0/tracks");
      if (response.status === 200) {
        const data = response.data.data;
        // Map data ke tipe Song dengan benar
        const mappedSongs: Song[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          artist: item.artist, // Tetap sebagai objek Artist
          album: item.album,
          cover: item.album.cover_medium,
          title_version: item.title_version || undefined, // Sesuaikan jika ada
          duration: item.duration || undefined, // Sesuaikan jika ada
          explicit_lyrics: item.explicit_lyrics || undefined, // Sesuaikan jika ada
          rank: item.rank || undefined, // Sesuaikan jika ada
          preview: item.preview || undefined, // Sesuaikan jika ada
          readable: item.readable || undefined, // Sesuaikan jika ada
          link: item.link || undefined, // Sesuaikan jika ada
        }));
        setRecommendations(mappedSongs);
      } else {
        setError("Gagal mengambil data dari Deezer");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(
        "https://api.deezer.com/chart/0/playlists"
      );
      if (response.status === 200) {
        const data = response.data.data;
        const mappedPlaylists: Playlist[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          cover: item.picture_medium, // Menggunakan picture_medium untuk cover
        }));
        setPlaylists(mappedPlaylists);
      } else {
        setErrorPlaylists("Gagal mengambil data playlists dari Deezer");
      }
    } catch (err) {
      console.error(err);
      setErrorPlaylists("Terjadi kesalahan saat mengambil data playlists");
    } finally {
      setLoadingPlaylists(false);
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await axios.get(
        "https://api.deezer.com/chart/0/artists"
      );
      if (response.status === 200) {
        const data = response.data.data;
        // Map data ke tipe Artist dengan benar
        const mappedArtists: Artist[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          picture_small: item.picture_small,
          picture_medium: item.picture_medium,
          picture_big: item.picture_big,
          picture_xl: item.picture_xl,
          link: item.link,
          radio: item.radio,
        }));
        setArtists(mappedArtists);
      } else {
        setErrorArtists("Gagal mengambil data artists dari Deezer");
      }
    } catch (err) {
      console.error(err);
      setErrorArtists("Terjadi kesalahan saat mengambil data artists");
    } finally {
      setLoadingArtists(false);
    }
  };

  if (loading || loadingPlaylists || loadingArtists) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </SafeAreaView>
    );
  }

  if (error || errorPlaylists || errorArtists) {
    Alert.alert(
      "Error",
      error || errorPlaylists || errorArtists || "Terjadi kesalahan",
      [{ text: "OK" }]
    );
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>
          {error || errorPlaylists || errorArtists}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Pengaturan Status Bar */}
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor="#f0f8ff"
      />

      {/* Header dengan logo */}
      <Text style={styles.logo}>ComBeats</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Rekomendasi Lagu */}
        <Text style={styles.sectionHeader}>Recommended Songs</Text>
        <FlatList
          data={recommendations}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/songDetail/${item.id}`)}
            >
              <View style={styles.songContainer}>
                <Image source={{ uri: item.cover }} style={styles.cover} />
                <Text style={styles.songTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.artistName} numberOfLines={1}>
                  {item.artist.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Playlist */}
        <Text style={styles.sectionHeader}>Playlists</Text>
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/playlistDetail/${item.id}`)}
            >
              <View style={styles.playlistContainer}>
                <Image
                  source={{ uri: item.cover }}
                  style={styles.playlistCover}
                />
                <Text style={styles.playlistTitle} numberOfLines={1}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Artists */}
        <Text style={styles.sectionHeader}>Artists</Text>
        <FlatList
          data={artists}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/artistDetail/${item.id}`)}
            >
              <View style={styles.artistContainer}>
                <Image
                  source={{ uri: item.picture_medium }}
                  style={styles.artistCover}
                />
                <Text style={styles.artistTitle} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingVertical: 20, // Menambahkan padding vertikal untuk keseluruhan scroll
    paddingBottom: 100, // Menambahkan margin bottom untuk jarak dari bawah
  },
  logo: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0066cc",
    textAlign: "center",
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0066cc",
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    alignSelf: "flex-start", // Mengatur agar teks align ke kiri
  },
  flatListContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  itemSeparator: {
    width: 15, // Jarak antar item
  },
  songContainer: {
    alignItems: "center",
    width: 120,
  },
  cover: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0066cc",
    textAlign: "center",
    marginTop: 8, // Menambahkan margin top untuk jarak dari gambar
  },
  artistName: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginTop: 4, // Menambahkan margin top untuk jarak dari judul lagu
  },
  playlistContainer: {
    alignItems: "center",
    width: 150,
  },
  playlistCover: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0066cc",
    textAlign: "center",
    marginTop: 8, // Menambahkan margin top untuk jarak dari gambar
  },
  artistContainer: {
    alignItems: "center",
    width: 150,
  },
  artistCover: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  artistTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0066cc",
    textAlign: "center",
    marginTop: 8, // Menambahkan margin top untuk jarak dari gambar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20, // Menambahkan margin top untuk jarak dari atas
  },
});

export default HomeScreen;
