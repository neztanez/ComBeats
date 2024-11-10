// services/api.ts
import axios from "axios";
import { Song } from "../types/Song";

// Menggunakan base URL
const apiClient = axios.create({
  baseURL: "https://api.deezer.com",
  timeout: 5000,
});

// Fungsi searchSongs
export const searchSongs = async (query: string): Promise<Song[]> => {
  try {
    const response = await apiClient.get(`/search`, {
      params: { q: query },
    });
    const songs: Song[] = response.data.data;
    return songs;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Implementasikan retry logic atau handling khusus jika diperlukan
      console.error("Axios error fetching songs:", error.message);
    } else {
      console.error("Unexpected error fetching songs:", error);
    }
    throw error; // Mengubah kembali error untuk ditangani di level komponen
  }
};

// Fungsi getSongDetail
export const getSongDetail = async (id: number): Promise<Song | null> => {
  try {
    const response = await apiClient.get(`/track/${id}`);
    const song: Song = response.data;
    return song;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching song detail:", error.message);
    } else {
      console.error("Unexpected error fetching song detail:", error);
    }
    return null;
  }
};
