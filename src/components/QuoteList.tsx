import { Quote } from "../types";

interface Props {
  quotes: Quote[];
}

export default function QuoteList({ quotes }: Props) {
  return (
    <ul>
      {quotes.map((q) => (
        <li key={q.id}>
          <blockquote>"{q.text}"</blockquote>
          <p>— {q.author || "Неизвестный автор"}</p>
        </li>
      ))}
    </ul>
  );
}
