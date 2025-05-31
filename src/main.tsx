import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Music from "./pages/Music.tsx";
import {Layout} from "./Layout/Layout.tsx";
import { SdkService } from './bastyon-sdk/sdkService.ts'
void SdkService.init()
// Инициализация SDK
const sdk = window.BastyonSdk;
console.log("testing sending notifications")
// Пример использования
async function sendNotification() {
  try {
    await sdk.notifications.send({
      title: 'Привет!',
      body: 'Это тестовое уведомление'
    });
  } catch (error) {
    console.error('Ошибка отправки:', error);
  }
}
sendNotification()

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
