// app/playlistDetail/[id].tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Audio } from "expo-av"; // Untuk fitur Play/Pause

type PlaylistDetail = {
  id: number;
  title: string;
  public: boolean;
  nb_tracks: number;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  checksum: string;
  tracklist: string;
  creation_date: string;
  md5_image: string;
  picture_type: string;
  user?: {
    id: number;
    name: string;
    tracklist: string;
    type: string;
  };
  type: string;
};

type Track = {
  id: number;
  readable: boolean;
  title: string;
  title_short: string;
  title_version: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  artist: {
    id: number;
    name: string;
    link: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    tracklist: string;
    type: string;
  };
  album: {
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
  type: string;
};

type TrackListResponse = {
  data: Track[];
  total: number;
  next?: string;
};

const PlaylistDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorTracks, setErrorTracks] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<number | null>(null);

  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);

  useEffect(() => {
    fetchPlaylistDetail();
    // Membersihkan suara saat komponen unmount
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [id]);

  const fetchPlaylistDetail = async () => {
    try {
      const response = await axios.get(`https://api.deezer.com/playlist/${id}`);
      console.log("Playlist Data:", response.data); // Debugging
      if (response.status === 200) {
        setPlaylist(response.data);
        // Memuat track awal
        await fetchInitialTracks(response.data.tracklist);
      } else {
        setError("Playlist tidak ditemukan.");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat mengambil data playlist.");
    } finally {
      setLoading(false); // Pastikan loading diatur ke false setelah data playlist diambil
    }
  };

  const fetchInitialTracks = async (tracklistUrl: string) => {
    try {
      const response = await axios.get<TrackListResponse>(tracklistUrl);
      console.log("Initial Tracks Data:", response.data); // Debugging
      if (response.status === 200) {
        setTracks(response.data.data);
        setNextUrl(response.data.next || null);
      } else {
        setErrorTracks("Gagal mengambil tracklist dari Deezer.");
      }
    } catch (err) {
      console.error(err);
      setErrorTracks("Terjadi kesalahan saat mengambil tracklist.");
    }
  };

  const fetchMoreTracks = async () => {
    if (!nextUrl || isFetchingMore) return;

    setIsFetchingMore(true);
    try {
      const response = await axios.get<TrackListResponse>(nextUrl);
      console.log("More Tracks Data:", response.data); // Debugging
      if (response.status === 200) {
        setTracks((prevTracks) => [...prevTracks, ...response.data.data]);
        setNextUrl(response.data.next || null);
      } else {
        Alert.alert("Error", "Gagal mengambil lebih banyak track.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Error",
        "Terjadi kesalahan saat mengambil lebih banyak track."
      );
    } finally {
      setIsFetchingMore(false);
    }
  };

  const playSound = async (previewUrl: string, trackId: number) => {
    try {
      // Jika ada track yang sedang diputar, hentikan terlebih dahulu
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        if (currentTrackId === trackId) {
          // Jika track yang sama ditekan, hentikan
          setCurrentTrackId(null);
          return;
        }
      }

      // Membuat objek suara baru
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: previewUrl,
      });
      setSound(newSound);
      setCurrentTrackId(trackId);
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const stopSound = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setCurrentTrackId(null);
      }
    } catch (error) {
      console.error("Error stopping sound:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </SafeAreaView>
    );
  }

  if (error || errorTracks) {
    Alert.alert("Error", error || errorTracks || "Terjadi kesalahan", [
      { text: "OK" },
    ]);
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error || errorTracks}</Text>
      </SafeAreaView>
    );
  }

  if (!playlist) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Pengaturan Status Bar */}
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor="#f0f8ff"
      />

      <View style={styles.containerCover}>
        {/* Cover Playlist */}
        <Image source={{ uri: playlist.picture_xl }} style={styles.coverArt} />
      </View>

      {/* Header (Dipindahkan ke bawah cover) */}
      <Text style={styles.header}>{playlist.title}</Text>

      {/* Daftar Lagu */}
      <Text style={styles.sectionHeader}>Tracks</Text>
      {tracks.length > 0 ? (
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.trackContainer}>
              {/* Cover Album Kecil */}
              <Image
                source={{ uri: item.album.cover_big }}
                style={styles.trackCover}
              />

              {/* Informasi Lagu */}
              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle}>{item.title}</Text>
                <Text style={styles.trackArtist}>{item.artist.name}</Text>
              </View>

              {/* Tombol Play/Pause */}
              {item.preview ? (
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => playSound(item.preview, item.id)}
                >
                  <Text style={styles.playButtonText}>
                    {currentTrackId === item.id ? "Pause" : "Play"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.noPreviewText}>No Preview</Text>
              )}
            </View>
          )}
          onEndReached={fetchMoreTracks}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator size="small" color="#0066cc" />
            ) : null
          }
        />
      ) : (
        <Text style={styles.infoText}>No tracks available.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    padding: 20,
    marginBottom: -35,
  },
  containerCover: {
    marginTop: 10,
    alignItems: "center",
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
    marginTop: 20,
  },
  coverArt: {
    width: "70%",
    height: 275, // Memastikan cover album cukup besar
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: "cover",
  },
  header: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0066cc",
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0066cc",
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  trackContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  trackCover: {
    width: 50, // Ukuran cover kecil
    height: 50, // Membuatnya persegi
    borderRadius: 5,
    marginRight: 10,
    resizeMode: "cover",
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  trackArtist: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  playButton: {
    backgroundColor: "#0066cc",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  noPreviewText: {
    fontSize: 14,
    color: "#666",
  },
});

export default PlaylistDetailScreen;
