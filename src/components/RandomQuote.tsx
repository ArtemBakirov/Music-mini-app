import { useState } from "react";
import { quoteDatabase } from "../data/quotes";
import { Quote } from "../types";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Link,
  Box,
} from "@mui/material";

export default function RandomQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);

  const getRandomQuote = () => {
    const index = Math.floor(Math.random() * quoteDatabase.length);
    setQuote(quoteDatabase[index]);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Button variant="contained" color="primary" onClick={getRandomQuote}>
        Показать цитату
      </Button>

      {quote && (
        <Card sx={{ marginTop: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              "{quote.text}"
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              — {quote.author}
            </Typography>
            {quote.sourceUrl && (
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Источник:{" "}
                <Link
                  href={quote.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {quote.sourceTitle || quote.sourceUrl}
                </Link>
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
