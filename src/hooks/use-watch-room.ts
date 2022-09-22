import { getDatabase, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";

type VideoStatus = "playing" | "stopped";

interface WatchRoom {
  id: string;
  youtubeVideoID?: string;
  videoStatus?: VideoStatus;
  videoTime?: number;
}

export function useWatchRoom(id?: string) {
  const [watchRoom, setWatchRoom] = useState<WatchRoom>({ id: id || 'public' });

  useEffect(() => {
    onValue(getWatchRoomRef(watchRoom.id), (snapshot) => {
      const data = snapshot.val();
      if (data) setWatchRoom(data);
    });
  }, [watchRoom.id]);

  function getWatchRoomRef(id: string) {
    const db = getDatabase();
    return ref(db, `watch-room/${id}`);
  }

  function save(item: WatchRoom) {
    setWatchRoom(item);
    set(getWatchRoomRef(watchRoom.id), item);
  }

  function setYoutubeVideo(youtubeURL: string) {
    var regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = youtubeURL.match(regExp);
    const youtubeVideoID =
      match && match[7].length === 11 ? match[7] : undefined;

      save({ ...watchRoom, youtubeVideoID, videoStatus: 'stopped', videoTime: 0 });
  }

  function setVideoStatus(videoStatus: VideoStatus) {
    save({ ...watchRoom, videoStatus });
  }

  function setVideoTime(videoTime: number) {
    save({ ...watchRoom, videoTime });
  }

  return { watchRoom, setYoutubeVideo, setVideoStatus, setVideoTime };
}
