import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { WatchRoom } from "../hooks/use-watch-room";

interface Props extends YouTubeProps {
  watchRoom: WatchRoom;
  userID: string;
  setNewWatchRoom: (newWatchRoom: Omit<WatchRoom, "id">) => void;
}

async function sync(player: any, watchRoom: WatchRoom) {
  if (Math.abs(player.getCurrentTime() - (watchRoom.videoTime || 0)) > 1) {
    player.seekTo(watchRoom.videoTime);
  }

  if (watchRoom.videoStatus === "played") {
    player.mute();
    player.playVideo();
    setTimeout(() => {
      player.unMute();
    }, 1000);
  } else {
    player.pauseVideo();
  }
}

export function YoutubePlayer({
  watchRoom,
  userID,
  setNewWatchRoom,
  ...props
}: Props) {
  const [player, setPlayer] = useState<any>();
  const [updateCurrentTime, setUpdateCurrentTime] = useState<any>();

  useEffect(() => {
    console.log(watchRoom);
    if (player && watchRoom.updatedUserID !== userID) {
      if (updateCurrentTime) clearInterval(updateCurrentTime);
      sync(player, watchRoom);
    }
  }, [player, updateCurrentTime, userID, watchRoom]);

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    sync(event.target, watchRoom);

    setPlayer(event.target);
  };

  const handlePlay = () => {
    console.log("handlePlay");
    if (watchRoom.videoStatus !== "played") {
      setNewWatchRoom({
        videoStatus: "played",
        updatedUserID: userID,
        videoTime: player.getCurrentTime(),
      });

      if (updateCurrentTime) clearInterval(updateCurrentTime);
      setUpdateCurrentTime(
        setInterval(() => {
          setNewWatchRoom({
            videoStatus: "played",
            updatedUserID: userID,
            videoTime: player.getCurrentTime(),
          });
        }, 2000)
      );
    }
  };

  const handlePause = () => {
    console.log("handlePause");
    if (watchRoom.videoStatus !== "paused") {
      setNewWatchRoom({
        videoStatus: "paused",
        updatedUserID: userID,
        videoTime: player.getCurrentTime(),
      });
    }
    if (updateCurrentTime) clearInterval(updateCurrentTime);
  };

  return watchRoom.youtubeVideoID ? (
    <>
      <YouTube
        videoId={watchRoom.youtubeVideoID}
        onPlay={handlePlay}
        onPause={handlePause}
        onReady={onPlayerReady}
        opts={{
          playerVars: {
            autoplay: 1,
          },
        }}
      />
    </>
  ) : (
    <Typography variant="body2" component="p">
      There is no video added.
    </Typography>
  );
}
