import {usePlaylists} from "../hooks/query/playlist.queries.ts";
import { useViewStateStore } from "../hooks/stores/useViewStateStore.ts";

export const Sidebar = () => {

  // react - query
  const { data: playlists } = usePlaylists("test_address");


  const { showPlaylist }  = useViewStateStore();


  return(
    <aside className="w-100 border-r-2 border-black p-4 flex flex-col bg-[#502B6C] text-gray-300">
      <h2>My Playlists</h2>
      <div className="flex flex-col gap-4 mt-6 w-full max-w-xl">
        {playlists?.length ? (
          playlists.map((playlist) => (
            <div
              key={playlist._id}
              onClick={() => showPlaylist(playlist._id)}
              className="flex p-4 rounded cursor-pointer hover:bg-[#62337E] transition"
            >
              <h3 className="text-lg font-semibold">{playlist.title} ----- {playlist.songs.length} songs</h3>
            </div>
          ))
        ) : (
          <p className="text-gray-400">You don't have any playlists yet.</p>
        )}
      </div>
      <h2>Other Playlists</h2>
    </aside>
  )
}
