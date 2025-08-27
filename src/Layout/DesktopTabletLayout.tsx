import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./App.tsx";
// import Music from "../pages/Music.tsx";
import Account from "../pages/Account.tsx";
import StartCreating from "../pages/StartCreating.tsx";
import TestIframe from "../pages/TestIframe.tsx";

export const DesktopTabletLayout = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<App />}
          children={
            <>
              <Route index element={<TestIframe videoId={"FakWEAvZE4g"} />} />
              <Route path="account" element={<Account />} />
              <Route path="create" element={<StartCreating />} />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
