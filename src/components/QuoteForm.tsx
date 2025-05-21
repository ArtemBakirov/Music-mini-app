import React, { useState } from "react";
import { Quote } from "../types";
import { v4 as uuidv4 } from "uuid";

interface Props {
  onAdd: (quote: Quote) => void;
}

export default function QuoteForm({ onAdd }: Props) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;

    const newQuote: Quote = {
      id: uuidv4(),
      text,
      author,
      date: new Date().toISOString(),
      sourceUrl : "",
    };
    onAdd(newQuote);
    setText("");
    setAuthor("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Введите цитату" />
      <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Автор" />
      <button type="submit">Добавить</button>
    </form>
  );
}
