import { Quote, MoodEntry } from "../types";

export const loadQuotes = (): Quote[] => {
  return JSON.parse(localStorage.getItem("quotes") || "[]");
};

export const saveQuotes = (quotes: Quote[]) => {
  localStorage.setItem("quotes", JSON.stringify(quotes));
};

export const loadMoods = (): MoodEntry[] => {
  return JSON.parse(localStorage.getItem("moods") || "[]");
};

export const saveMoods = (moods: MoodEntry[]) => {
  localStorage.setItem("moods", JSON.stringify(moods));
};
