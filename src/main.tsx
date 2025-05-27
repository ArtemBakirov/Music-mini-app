import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { SdkService } from './bastyon-sdk/sdkService.ts'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home.tsx";
import {Music} from "./pages/Music.tsx";
import {Layout} from "./Layout/Layout.tsx";
void SdkService.init()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} children={
          <>
            <Route index element={<Home />} />
            <Route path="music" element={<Music />} />
          </>
        } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
