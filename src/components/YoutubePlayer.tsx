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
  updateVideoTime: (videoTime: number, updatedUserID: string) => void;
}

function playerIsPlayed(player: any) {
  return player?.getPlayerState() === 1;
}

function timeDifferenceIsGraterThan(
  player: any,
  watchRoom: WatchRoom,
  threshold: number
) {
  return (
    Math.abs(player?.getCurrentTime() - (watchRoom.videoTime || 0)) > threshold
  );
}

export function YoutubePlayer({
  watchRoom,
  userID,
  updateVideoStatus,
  updateVideoTime,
}: Props) {
  const [player, setPlayer] = useState<any>();

  useEffect(() => {
    function updateCurrentTime() {
      if (watchRoom.updatedUserID === userID) {
        if (player?.getCurrentTime() !== watchRoom.videoTime) {
          console.log("Updating video time");
          updateVideoTime(player?.getCurrentTime(), userID);
        }
      } else {
        if (
          watchRoom.videoStatus === "played" &&
          playerIsPlayed(player) &&
          timeDifferenceIsGraterThan(player, watchRoom, 2)
        ) {
          console.log("Updating video time");
          updateVideoTime(player?.getCurrentTime(), userID);
        }
      }
    }

    async function sync(player: any, watchRoom: WatchRoom) {
      if (timeDifferenceIsGraterThan(player, watchRoom, 1)) {
        player?.seekTo(watchRoom.videoTime);
      }

      if (watchRoom.videoStatus === "played") {
        if (!playerIsPlayed(player)) {
          player?.mute();
          player?.playVideo();
          setTimeout(() => {
            player?.unMute();
          }, 1000);
        }
      } else {
        player?.pauseVideo();
      }
    }

    const interval = setInterval(() => {
      updateCurrentTime();
    }, 500);

    sync(player, watchRoom);

    return () => clearInterval(interval);
  }, [player, updateVideoTime, userID, watchRoom]);

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    setPlayer(event.target);
  };

  const handlePlay = () => {
    if (watchRoom.videoStatus !== "played") {
      updateVideoStatus("played", player?.getCurrentTime(), userID);
    }
  };

  const handlePause = () => {
    if (watchRoom.videoStatus !== "paused") {
      updateVideoStatus("paused", player?.getCurrentTime(), userID);
    }
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
