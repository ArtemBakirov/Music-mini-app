/*import {Box, Typography} from "@mui/material";
import RandomQuote from "../components/RandomQuote";
import { useState, useEffect } from "react";
import {PicturesService} from "../services/pictures.service.ts";
import {Quote} from "../types";
import {QuotesService} from "../services/quotes.service.ts";

function Home() {
  const [backgroundUrl, setBackgroundUrl] = useState<string>('./assets/example-background.jpg');
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const fetchBackground = async () => {
      const background = await PicturesService.getRandomPicture()
      setBackgroundUrl(background);
    };
    fetchBackground();
  }, []);

  useEffect(() => {
    const fetchQuotes = async () => {
      const quote = await QuotesService.getRandomQuote();
      setQuote(quote);
    };
    fetchQuotes();
  }, []);




           className={"main-container w-full flex flex-col items-center justify-center"}>
        <div className={"flex flex-col gap-4 items-center justify-center"}>
          <Typography variant="h4" align="center" gutterBottom>
            Daily motivation
          </Typography>
          <RandomQuote quote={quote} />
        </div>
      </Box>
  );
}

export default Home;*/
