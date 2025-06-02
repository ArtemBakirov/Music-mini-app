import { Button } from "../Layout/ui/Button.tsx";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { ModalWrapper } from "../Layout/ui/ModalWrapper.tsx";
import { CreatePlaylistModal } from "../components/CreatePlayListModal.tsx";
import { useState } from "react";

export const PlayLists = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const createPlayList = async () => {
    /*const response = await axios.post(`https:/localhost:3000/api/playlists`, {
      title: "New PlayList",
      owner: user?.pubkey,
    }); */
    setIsOpen(true);
  };

  return (
    <div
      className={
        "bg-[#371A4D] h-screen p-4 pt-12 w-full flex flex-col gap-4 items-center"
      }
    >
      This is the PlayLists page. You can add your playlists here.
      <h2>Your Playlists:</h2>
      <p>You don't have any playlists yet.</p>
      <Button title={"Create new playlist"} onClick={createPlayList} />
      <ModalWrapper isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {/*<CreatePlaylistModal onClose={() => {}} />*/}
        <CreatePlaylistModal />
      </ModalWrapper>
    </div>
  );
};
