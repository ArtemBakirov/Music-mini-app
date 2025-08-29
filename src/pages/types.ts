type JamendoTrack = {
  id: string;
  name: string;
  artist_id: string;
  artist_name: string;
  album_name: string;
  album_image: string;
  audio: string; // stream/preview
};

type JamendoAlbum = {
  id: string;
  name: string;
  artist_name: string;
  image: string;
};

type JamendoArtist = {
  id: string;
  name: string;
  image: string;
};

type JamendoPlaylist = {
  id: string;
  name: string;
  image: string;
  user_name?: string;
};
