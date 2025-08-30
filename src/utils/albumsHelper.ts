import {
  JamendoAlbum,
  useJamendoAlbum,
} from "../hooks/query/jamendo.queries.ts";

export const getExistingImage = (album: JamendoAlbum) => {
  const { data } = useJamendoAlbum(album?.id);
  const tracks = data?.tracks;
  const tracksCount = tracks?.length;
  let image = album.image;
  if (tracksCount === 1) {
    const track = tracks?.[0];
    image = `${album.image}&trackid=${track?.id}`;
  }
  return image;
};
