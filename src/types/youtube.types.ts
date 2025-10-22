export type Song = {
  channelTitle: string;
  audioId: string;
  thumbnail: string;
  title: string;
};

export type YtChannelMeta = {
  id: string;
  title: string;
  avatar: string | null;
  banner: string | null;
  unsubscribedTrailer: string | null;
};
