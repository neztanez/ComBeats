import { Song } from "./Song";

export type StackParamList = {
  Back: undefined; // Menambahkan BottomTabs tanpa parameter
  Search: undefined;
  SongDetail: { song: Song }; // SongDetail membutuhkan parameter song dari tipe Song
};
