// app/artistDetails/[id].tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Audio } from "expo-av"; // Untuk fitur Play/Pause

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
  title_version?: string;
  duration?: number;
  explicit_lyrics?: boolean;
  rank?: number;
  preview?: string;
  readable?: boolean;
  link?: string;
};

type AlbumListResponse = {
  data: Album[];
  total: number;
  next?: string;
};

type SongListResponse = {
  data: Song[];
  total: number;
  next?: string;
};

const { width } = Dimensions.get("window");

const ArtistDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [artist, setArtist] = useState<Artist | null>(null);
  const [topTracks, setTopTracks] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    fetchArtistDetails();
    // Membersihkan suara saat komponen unmount
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [id]);

  const fetchArtistDetails = async () => {
    try {
      const [artistRes, topTracksRes, albumsRes] = await Promise.all([
        axios.get(`https://api.deezer.com/artist/${id}`),
        axios.get(`https://api.deezer.com/artist/${id}/top?limit=10`),
        axios.get(`https://api.deezer.com/artist/${id}/albums`),
      ]);

      if (artistRes.status === 200) {
        setArtist(artistRes.data);
      } else {
        setError("Gagal mengambil data artis.");
      }

      if (topTracksRes.status === 200) {
        const data = topTracksRes.data.data.map((item: any) => ({
          ...item,
          cover: item.cover || item.album.cover_medium, // Menggunakan track cover jika ada, else album cover
        }));
        setTopTracks(data);
      } else {
        setError("Gagal mengambil top tracks.");
      }

      if (albumsRes.status === 200) {
        setAlbums(albumsRes.data.data);
      } else {
        setError("Gagal mengambil album.");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat mengambil data.");
    } finally {
      setLoading(false);
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
          setIsPlaying(false);
          return;
        }
      }

      // Membuat objek suara baru
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: previewUrl,
      });
      setSound(newSound);
      setCurrentTrackId(trackId);
      setIsPlaying(true);
      await newSound.playAsync();

      // Handle ketika playback selesai
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          setCurrentTrackId(null);
          newSound.unloadAsync();
          setSound(null);
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const pauseSound = async () => {
    try {
      if (sound && isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error pausing sound:", error);
    }
  };

  const resumeSound = async () => {
    try {
      if (sound && !isPlaying) {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error resuming sound:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </SafeAreaView>
    );
  }

  if (error || !artist) {
    Alert.alert("Error", error || "Data artis tidak ditemukan.", [
      { text: "OK" },
    ]);
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>
          {error || "Data artis tidak ditemukan."}
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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Informasi Artis */}
        <View style={styles.artistHeader}>
          <Image
            source={{ uri: artist.picture_xl }}
            style={styles.artistImage}
          />
          <Text style={styles.artistName}>{artist.name}</Text>
          <TouchableOpacity
            onPress={() => router.push(`/artistDetail/${artist.id}`)}
          >
            <Text style={styles.artistLink}>View on Deezer</Text>
          </TouchableOpacity>
        </View>

        {/* Top Tracks */}
        <Text style={styles.sectionHeader}>Top Tracks</Text>
        <FlatList
          data={topTracks}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          renderItem={({ item }) => (
            <View style={styles.trackContainer}>
              <Image
                source={{ uri: item.cover || item.album.cover_medium }}
                style={styles.trackCover}
              />
              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.trackArtist} numberOfLines={1}>
                  {item.artist.name}
                </Text>
              </View>
              {item.preview ? (
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() =>
                    currentTrackId === item.id
                      ? isPlaying
                        ? pauseSound()
                        : resumeSound()
                      : playSound(item.preview!, item.id)
                  }
                >
                  <Text style={styles.playButtonText}>
                    {currentTrackId === item.id && isPlaying ? "Pause" : "Play"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.noPreviewText}>No Preview</Text>
              )}
            </View>
          )}
        />

        {/* Albums */}
        <Text style={styles.sectionHeader}>Albums</Text>
        <FlatList
          data={albums}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {}}>
              <View style={styles.albumContainer}>
                <Image
                  source={{ uri: item.cover_medium }}
                  style={styles.albumCover}
                />
                <Text style={styles.albumTitle} numberOfLines={1}>
                  {item.title}
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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  artistHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  artistImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#ffffff",
  },
  artistName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0066cc",
    textAlign: "center",
    marginTop: 15,
  },
  artistLink: {
    fontSize: 16,
    color: "#0066cc",
    textAlign: "center",
    marginTop: 5,
    textDecorationLine: "underline",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0066cc",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  flatListContainer: {
    paddingLeft: 0,
    paddingRight: 20,
  },
  itemSeparator: {
    width: 15,
  },
  trackContainer: {
    width: 200,
    alignItems: "center",
  },
  trackCover: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  trackInfo: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0066cc",
    textAlign: "center",
  },
  trackArtist: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginTop: 4,
  },
  playButton: {
    backgroundColor: "#0066cc",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  noPreviewText: {
    fontSize: 14,
    color: "#666666",
    marginTop: 10,
  },
  albumContainer: {
    alignItems: "center",
    width: 150,
  },
  albumCover: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0066cc",
    textAlign: "center",
    marginTop: 8,
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
});

export default ArtistDetailScreen;
