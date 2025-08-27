import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./App.tsx";
import Account from "../pages/Account.tsx";
import MusicMobile from "../pages/MusicMobile.tsx";

export const MobileLayout = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<App />}
          children={
            <>
              <Route index element={<MusicMobile />} />
              <Route path="account" element={<Account />} />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
