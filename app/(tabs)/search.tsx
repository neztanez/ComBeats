// screens/SearchScreen.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ListRenderItemInfo,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { searchSongs } from "../../services/api";
import { Song } from "../../types/Song";
import SongItem from "../../components/SongItem"; // Pastikan path ini benar

const { width } = Dimensions.get("window");

const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchSongs(query);
      setSongs(results);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSongPress = (song: Song) => {
    router.push({
      pathname: `/songDetail/[id]`,
      params: { id: song.id.toString() },
    });
  };

  const renderItem = ({ item }: ListRenderItemInfo<Song>) => (
    <SongItem song={item} onPress={() => handleSongPress(item)} />
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f0f8ff" />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search for a song..."
              placeholderTextColor="#ccc"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* Activity Indicator */}
          {loading && (
            <ActivityIndicator
              size="large"
              color="#0066cc"
              style={styles.loader}
            />
          )}

          {/* No Results Message */}
          {!loading && songs.length === 0 && query.trim() !== "" && (
            <Text style={styles.noResultsText}>
              No songs found. Try a different search.
            </Text>
          )}

          {/* Daftar Lagu */}
          <FlatList
            data={songs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 20,
    paddingTop: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#000",
    backgroundColor: "#fff",
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#0066cc",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 10,
  },
  noResultsText: {
    color: "#333",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 20,
    marginHorizontal: 20,
  },
});

export default SearchScreen;
