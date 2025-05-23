import axios from "axios";

export class PicturesService {
  static async getRandomPicture(): Promise<string> {
    const response = await axios.get(
      import.meta.env.VITE_UNSPLASH_URL
    );
    return response.data.urls.raw;
  }
}
