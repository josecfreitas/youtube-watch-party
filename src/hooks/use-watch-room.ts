import { getDatabase, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";

export type VideoStatus = "played" | "paused";

export interface WatchRoom {
  id: string;
  youtubeVideoID?: string;
  videoStatus?: VideoStatus;
  videoTime?: number;
  updatedUserID?: string;
}

export function useWatchRoom(id = "public") {
  const [watchRoom, setWatchRoom] = useState<WatchRoom>();

  useEffect(() => {
    onValue(getWatchRoomRef(id), (snapshot) => {
      const data = snapshot.val();
      if (data) setWatchRoom(data);
      else setWatchRoom({ id });
    });
  }, [id]);

  function getWatchRoomRef(id: string) {
    const db = getDatabase();
    return ref(db, `watch-room/${id}`);
  }

  function save(item: WatchRoom) {
    setWatchRoom(item);
    set(getWatchRoomRef(id), item);
  }

  function setYoutubeVideo(youtubeVideoID: string) {
    if (watchRoom)
      save({
        ...watchRoom,
        youtubeVideoID,
        videoStatus: "paused",
        videoTime: 0,
      });
  }

  function setNewWatchRoom(newWatchRoom: Omit<WatchRoom, 'id'>) {
    if (watchRoom) save({ ...watchRoom, ...newWatchRoom });
  }

  return { watchRoom, setYoutubeVideo, setNewWatchRoom };
}
