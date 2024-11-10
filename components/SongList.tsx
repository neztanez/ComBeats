import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Song } from "../types/Song";

interface SongListProps {
  songs: Song[];
  onSongPress: (song: Song) => void;
}

const SongList: React.FC<SongListProps> = ({ songs, onSongPress }) => {
  return (
    <FlatList
      data={songs}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSongPress(item)}>
          <View style={styles.songContainer}>
            <Image source={{ uri: item.album.cover }} style={styles.cover} />
            <View>
              <Text style={styles.songTitle}>{item.title}</Text>
              <Text style={styles.songArtist}>{item.artist.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  songContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  cover: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0066CC",
  },
  songArtist: {
    fontSize: 16,
    color: "#666",
  },
});

export default SongList;
