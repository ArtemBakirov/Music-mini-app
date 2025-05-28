import axios from "axios";

export class MusicSearchService {
  static async searchYouTube(query: string) {
    const response = await fetch(
      `http://localhost:3000/api/music/youtubeSearch?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch YouTube results");
    }

    return response.json();
  }
}
