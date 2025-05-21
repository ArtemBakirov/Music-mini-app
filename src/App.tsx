import { Typography } from "@mui/material";
import RandomQuote from "./components/RandomQuote";

function App() {
  return (
    <div className={"text-red-600"}>
      <Typography variant="h4" align="center" gutterBottom>
        Цитаты на каждый день
      </Typography>
      <RandomQuote />
    </div>
  );
}

export default App;
