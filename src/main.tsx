import {StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Music from "./pages/Music.tsx";
import {Layout} from "./Layout/Layout.tsx";






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
