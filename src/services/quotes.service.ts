import {Quote} from "../types";
import axios from "axios";

export class QuotesService {
  static async getRandomQuote(): Promise<Quote> {
    const response = await axios.get(
      import.meta.env.VITE_QUOTES_URL
    );
    console.log("response quotes", response.data);
    return response.data;
  }
}
