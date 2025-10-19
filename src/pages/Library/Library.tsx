import { Outlet } from "react-router-dom";

export const Library = () => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 text-white pt-20 pb-52">
      <h1 className="text-2xl font-bold mb-6">Library</h1>

      <Outlet />
    </div>
  );
};
