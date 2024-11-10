// app/songDetail/[id].tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getSongDetail } from "../../services/api";
import { Song } from "../../types/Song";
import { Audio } from "expo-av"; // Import Audio dari expo-av
import { Ionicons } from "@expo/vector-icons";

const SongDetail: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const fetchSongDetail = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const result = await getSongDetail(Number(id));
        if (result) {
          setSong(result);
        } else {
          setError("Song not found.");
        }
      } catch (err) {
        setError("Failed to load song details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSongDetail();

    // Cleanup saat komponen unmount
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [id]);

  const handlePlayPreview = async () => {
    if (sound) {
      // Jika sudah ada suara yang dimuat
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } else if (song?.preview) {
      // Memuat preview jika belum dimuat
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: song.preview },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      );
      setSound(newSound);
      setIsPlaying(true);
    }
  };

  const handleListenFull = () => {
    if (song?.link) {
      Linking.openURL(song.link).catch(() => {
        Alert.alert("Error", "Unable to open Deezer link.");
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!song) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        {/* Cover Album */}
        <Image source={{ uri: song.album.cover_xl }} style={styles.coverArt} />
      </View>

      {/* Details Card */}
      <View style={styles.detailsCard}>
        {/* Logo Circle */}
        <View style={styles.logoCircle}>
          {song.artist.picture_medium ? (
            <Image
              source={{ uri: song.artist.picture_xl }}
              style={styles.logoImage}
            />
          ) : (
            <Text style={styles.logoText}>Logo</Text>
          )}
        </View>

        {/* Judul Lagu */}
        <Text style={styles.songTitle}>{song.title_short}</Text>
        {song.title_version ? (
          <Text style={styles.artistVersion}>({song.title_version})</Text>
        ) : null}

        {/* Nama Artis */}
        <TouchableOpacity
          onPress={() => {
            if (song.artist.link) {
              Linking.openURL(song.artist.link).catch(() => {
                Alert.alert("Error", "Unable to open artist link.");
              });
            }
          }}
        >
          <Text style={styles.artist}>{song.artist.name}</Text>
        </TouchableOpacity>

        {/* Informasi Album */}
        {"link" in song.album && song.album.link ? (
          <TouchableOpacity
            onPress={() => {
              if (song.album.link) {
                Linking.openURL(song.album.link).catch(() => {
                  Alert.alert("Error", "Unable to open album link.");
                });
              }
            }}
          >
            <Text style={styles.album}>Album: {song.album.title}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.album}>Album: {song.album.title}</Text>
        )}

        {/* Durasi Lagu */}
        <Text style={styles.duration}>
          Duration: {Math.floor(song.duration / 60)}:
          {song.duration % 60 < 10
            ? `0${song.duration % 60}`
            : song.duration % 60}{" "}
          minutes
        </Text>

        {/* Explicit Lyrics */}
        {song.explicit_lyrics ? (
          <Text style={styles.explicit}>Contains Explicit Lyrics 🔞</Text>
        ) : null}
      </View>

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        {/* Tombol Play/Pause Preview */}
        {song.preview && song.readable ? (
          <TouchableOpacity
            style={styles.button}
            onPress={handlePlayPreview}
            accessibilityLabel={isPlaying ? "Pause preview" : "Play preview"}
            accessibilityHint="Plays a 30-second preview of the song"
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>
              {isPlaying ? "Pause Preview" : "Play Preview"}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.unavailableText}>Preview Unavailable</Text>
        )}

        {/* Tombol Listen Full on Deezer */}
        {song.link && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleListenFull}
            accessibilityLabel="Listen on Deezer"
            accessibilityHint="Opens the song in Deezer to listen to the full track"
          >
            <Text style={styles.buttonText}>Listen on Deezer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f8ff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#0066cc",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 12,
  },
  coverArt: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 12,
  },
  detailsCard: {
    backgroundColor: "#d9d9d9",
    padding: 24,
    borderRadius: 8,
    marginVertical: 8,
    position: "relative",
  },
  logoCircle: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 120,
    height: 120,
    backgroundColor: "#666666",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  logoText: {
    fontSize: 10,
    color: "#fff",
  },
  songTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    color: "#0066cc",
  },
  artistVersion: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  artist: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    paddingRight: 130,
    textDecorationLine: "underline",
  },
  album: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    marginBottom: 8,
    paddingRight: 130,
  },
  duration: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    marginBottom: 8,
  },
  explicit: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff0000",
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 16,
    marginTop: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0066cc",
    paddingVertical: 16,
    width: "48%",
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: "#f0f8ff",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "900",
  },
  unavailableText: {
    fontSize: 16,
    color: "#ff0000",
    marginBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff0000",
    fontSize: 18,
    textAlign: "center",
  },
  genre: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  icon: {
    marginRight: 6, // Jarak antara ikon dan teks
  },
});

export default SongDetail;
