import { useNavigate } from "react-router-dom";

import Back from "../assets/icons/back.svg?react";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        // go back in history
        navigate(-1);
      }}
      className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
    >
      <Back />
    </button>
  );
};
