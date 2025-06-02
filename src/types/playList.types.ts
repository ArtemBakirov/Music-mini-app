export interface Song {
  videoId: string;
  title: string;
  thumbnailUrl: string;
}

export interface Playlist {
  _id?: string;
  name: string;
  creatorPubKey: string;
  songs: Song[];
  createdAt?: string;
}
