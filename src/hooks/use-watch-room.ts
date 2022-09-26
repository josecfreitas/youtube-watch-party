import { getDatabase, onValue, ref, set, update } from "firebase/database";
import { useEffect, useState } from "react";

export type VideoStatus = "played" | "paused";

export interface WatchRoom {
  id?: string;
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

  function getWatchRoomRef(id: string, subid = "") {
    const db = getDatabase();
    return ref(db, `watch-room/${id}${subid}`);
  }

  function save(item: WatchRoom) {
    set(getWatchRoomRef(id), item);
  }

  function setYoutubeVideo(youtubeVideoID: string, userID: string) {
    if (watchRoom)
      save({
        youtubeVideoID,
        videoStatus: "paused",
        videoTime: 0,
        updatedUserID: userID,
      });
  }

  function updateVideoStatus(
    videoStatus: VideoStatus,
    videoTime: number,
    updatedUserID: string
  ) {
    const updates = { videoStatus, videoTime, updatedUserID };
    update(getWatchRoomRef(id), updates);
  }

  function updateVideoTime(videoTime: number, updatedUserID: string) {
    const updates = { videoTime, updatedUserID };
    update(getWatchRoomRef(id), updates);
  }

  return { watchRoom, setYoutubeVideo, updateVideoStatus, updateVideoTime };
}
