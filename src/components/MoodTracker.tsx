import { useState } from "react";
import { Mood, MoodEntry } from "../types";

interface Props {
  onSetMood: (mood: MoodEntry) => void;
}

const moods: Mood[] = ['😊', '😐', '😢'];

export default function MoodTracker({ onSetMood }: Props) {
  const [selected, setSelected] = useState<Mood | null>(null);

  const handleClick = (mood: Mood) => {
    setSelected(mood);
    const today = new Date().toISOString().split("T")[0];
    onSetMood({ mood, date: today });
  };

  return (
    <div>
      <p>Как настроение?</p>
      {moods.map((m) => (
        <button key={m} onClick={() => handleClick(m)}>{m}</button>
      ))}
      {selected && <p>Вы выбрали: {selected}</p>}
    </div>
  );
}
