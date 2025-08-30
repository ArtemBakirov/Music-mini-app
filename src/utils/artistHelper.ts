import { JamendoArtist } from "../hooks/query/jamendo.queries";
import no_image from "../assets/picture/no_image.png";

export const setArtistImage = (artist: JamendoArtist) => {
  let imageSrc = artist.image;
  if (imageSrc === "") {
    imageSrc = no_image;
  }
  return imageSrc;
};
