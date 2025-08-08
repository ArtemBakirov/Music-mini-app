export interface Song {
  videoId: string;
  title: string;
  thumbnailUrl: string;
}

export interface JamendoSong {
  id: string;
  name: string;
  artist_name: string;
  audio: string;
  album_image: string;
}

export interface Playlist {
  _id: string;
  title: string;
  creatorPubKey: string;
  songs: Song[];
  createdAt?: string;
}

export type PlaylistSongsIds = {
  _id: string;
  videoIds: string[];
};
