import { Quote } from "../types";

export const quoteDatabase: Quote[] = [
  {
    id: "1",
    text: "Будь собой. Прочие роли уже заняты.",
    author: "Оскар Уайльд",
    sourceUrl: "https://ru.wikiquote.org/wiki/Оскар_Уайльд",
    sourceTitle: "Wikiquote: Оскар Уайльд",
    date: new Date().toISOString(),
  },
  {
    id: "2",
    text: "Я мыслю — следовательно, я существую.",
    author: "Рене Декарт",
    sourceUrl: "https://plato.stanford.edu/entries/descartes/",
    sourceTitle: "Stanford Encyclopedia of Philosophy",
    date: new Date().toISOString(),
  },
  // ...добавь ещё
];
