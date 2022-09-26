import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { VideoStatus, WatchRoom } from "../hooks/use-watch-room";

interface Props extends YouTubeProps {
  watchRoom: WatchRoom;
  userID: string;
  updateVideoStatus: (
    videoStatus: VideoStatus,
    videoTime: number,
    updatedUserID: string
  ) => void;
  updateVideoTime: (videoTime: number) => void;
}

async function sync(player: any, watchRoom: WatchRoom) {
  if (Math.abs(player.getCurrentTime() - (watchRoom.videoTime || 0)) > .5) {
    player.seekTo(watchRoom.videoTime);
  }

  if (watchRoom.videoStatus === "played") {
    const playerIsNotPlayed = player.getPlayerState() !== 1;
    if (playerIsNotPlayed) {
      player.mute();
      player.playVideo();
      setTimeout(() => {
        player.unMute();
      }, 1000);
    }
  } else {
    player.pauseVideo();
  }
}

export function YoutubePlayer({
  watchRoom,
  userID,
  updateVideoStatus,
  updateVideoTime,
}: Props) {
  const [player, setPlayer] = useState<any>();
  const [updateCurrentTimeInterval, setUpdateCurrentTimeInterval] =
    useState<any>();

  useEffect(() => {
    console.log(watchRoom);
    if (player && watchRoom.updatedUserID !== userID) {
      if (updateCurrentTimeInterval) clearInterval(updateCurrentTimeInterval);
      sync(player, watchRoom);
    }
  }, [player, updateCurrentTimeInterval, userID, watchRoom]);

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    sync(event.target, watchRoom);

    setPlayer(event.target);
  };

  const handlePlay = () => {
    console.log("handlePlay");
    if (watchRoom.videoStatus !== "played") {
      updateVideoStatus("played", player.getCurrentTime(), userID);

      if (updateCurrentTimeInterval) clearInterval(updateCurrentTimeInterval);
      setUpdateCurrentTimeInterval(
        setInterval(() => {
          updateVideoTime(player.getCurrentTime());
        }, 500)
      );
    }
  };

  const handlePause = () => {
    console.log("handlePause");
    if (watchRoom.videoStatus !== "paused") {
      updateVideoStatus("paused", player.getCurrentTime(), userID);
    }
    if (updateCurrentTimeInterval) clearInterval(updateCurrentTimeInterval);
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
