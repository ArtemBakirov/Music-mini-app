import {useEffect, useState} from "react";
import {SearchInput} from "../components/SearchInput.tsx";
import {DisplaySongCard} from "../components/DisplaySongCard.tsx";
import { SdkService } from '../bastyon-sdk/sdkService.ts'
// Инициализация SDK
const sdk = window.BastyonSdk;


// Пример использования
async function sendNotification() {
  await SdkService.init().then(async () => {
    try {
      await sdk.notifications.send({
        title: 'Привет!',
        body: 'Это тестовое уведомление'
      });
    } catch (error) {
      console.error('Ошибка отправки:', error);
    }
  }).catch((error) => {
    console.log("Error sending notification / initializing", error)
  });
}

export default function Music() {

  useEffect(() => {
    console.log("testing sending notifications")
    sendNotification()
  }, [])

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const search = async () => {
    const res = await fetch(`http://localhost:3000/api/music/youtubeSearch?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    console.log("data is", data);
    setResults(data);
  };

  return (
    <div className={" bg-[#371A4D] h-screen p-4 w-full flex flex-col gap-4 items-center"}>
      <h2>Search music</h2>
      <div className={"w-[80%]"}>
        <SearchInput onClick={search} query={query} setQuery={setQuery} />
      </div>

      <button onClick={search}>Search</button>
      <div className={"flex flex-col gap-4 padding-2 overflow-y-scroll"}>
        {results.map((item, idx) => (
            <DisplaySongCard songData={item} idx={idx} />
        ))}
      </div>
    </div>
  );
}
