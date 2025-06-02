// components/CreatePlaylistModal.tsx
import { useState } from "react";
import { usePlaylistStore } from "../hooks/stores/usePlayListStore.ts";
import { Button } from "../Layout/ui/Button.tsx";
import { Input } from "../Layout/ui/Input.tsx";
// validate inputs
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  playListName: z
    .string()
    .min(5, "The name of the playlist must be at least 5 characters long"),
});
type FormData = z.infer<typeof formSchema>;

export const CreatePlaylistModal = () => {
  const [name, setName] = useState("");
  const { addPlaylist } = usePlaylistStore();
  //const [playListName, setPlaylistName] = useState("");

  const handleCreate = async () => {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    const user = (await window.BastyonSdk?.get?.account()) || "test_user";
    const address = user.address || "test_address";
    const newPlaylist = {
      title: data.playListName,
      owner: address,
      songs: [],
    };
    const res = await fetch("http://localhost:3000/api/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlaylist),
    });

    const saved = await res.json();
    addPlaylist(saved);
    console.log("Form submitted", data);
  };

  return (
    <div className="p-4 flex flex-col gap-6 min-w-[29rem]">
      <h2 className="text-xl font-bold mb-2">Create Playlist</h2>
      <form
        className="p-4 flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          //query={playListName}
          // setQuery={setPlaylistName}
          placeholder={"name for your playlist"}
          {...register("playListName")}
        />
        {
          <p
            className={`text-red-500 text-sm opacity-0 ${errors.playListName?.message && "opacity-100"}`}
          >
            {errors.playListName?.message}
          </p>
        }
        <Button type={"submit"} title={"Create new playlist"} />
      </form>
    </div>
  );
};
