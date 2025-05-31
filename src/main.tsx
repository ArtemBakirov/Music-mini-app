import {StrictMode, useEffect} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Music from "./pages/Music.tsx";
import {Layout} from "./Layout/Layout.tsx";
import { SdkService } from './bastyon-sdk/sdkService.ts'
// Инициализация SDK
const sdk = window.BastyonSdk;


useEffect(() => {
  console.log("testing sending notifications")
  sendNotification()
}, [])

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


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} children={
          <>
            <Route index element={<Music/>} />
            <Route path="music" element={<Music />} />
          </>
        } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
