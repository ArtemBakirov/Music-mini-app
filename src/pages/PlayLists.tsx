import { Button } from "../Layout/ui/Button.tsx";
import { useAuth } from "../hooks/useAuth";
import { ModalWrapper } from "../Layout/ui/ModalWrapper.tsx";
import { CreatePlaylistModal } from "../components/CreatePlayListModal.tsx";
import { useState } from "react";
import { usePlaylists } from "../hooks/query/playlist.queries.ts";
import { useNavigate } from "react-router-dom";

export const PlayLists = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // react-query
  const { data: playlists } = usePlaylists("test_address");

  const createPlayList = async () => {
    /*const response = await axios.post(`https:/localhost:3000/api/playlists`, {
      title: "New PlayList",
      owner: user?.pubkey,
    }); */
    setIsOpen(true);
  };

  const handleOpenPlaylist = (playlistId: string) => {
    navigate(`/playlists/${playlistId}`);
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
      <div className="flex flex-col gap-4 mt-6 w-full max-w-xl">
        {playlists?.length ? (
          playlists.map((playlist) => (
            <div
              key={playlist._id}
              onClick={() => handleOpenPlaylist(playlist._id)}
              className="bg-[#502B6C] p-4 rounded cursor-pointer hover:bg-[#62337E] transition"
            >
              <h3 className="text-lg font-semibold">{playlist.title}</h3>
              <p className="text-sm text-gray-300">
                {playlist.songs.length} songs
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">You don't have any playlists yet.</p>
        )}
      </div>
      <ModalWrapper isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {/*<CreatePlaylistModal onClose={() => {}} />*/}
        <CreatePlaylistModal />
      </ModalWrapper>
    </div>
  );
};
