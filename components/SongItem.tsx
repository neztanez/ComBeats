// components/SongItem.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Song } from "../types/Song";

interface SongItemProps {
  song: Song;
  onPress: () => void;
}

const SongItem: React.FC<SongItemProps> = React.memo(({ song, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessibilityLabel={`Song titled ${song.title_short} by ${song.artist.name}`}
      accessibilityHint="Tap to view song details"
    >
      {/* Menampilkan artwork album jika tersedia */}
      {song.album && song.album.cover_medium ? (
        <Image
          source={{ uri: song.album.cover_medium }}
          style={styles.albumArt}
        />
      ) : (
        <View style={styles.placeholderArt}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {song.title_short || song.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">
          {song.artist.name}
        </Text>
        {/* Opsional: Menampilkan nama album jika tersedia */}
        {song.album && (
          <Text style={styles.album} numberOfLines={1} ellipsizeMode="tail">
            {song.album.title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  albumArt: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  placeholderArt: {
    width: 60,
    height: 60,
    borderRadius: 5,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  placeholderText: {
    color: "#fff",
    fontSize: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  artist: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  album: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
});

export default SongItem;
