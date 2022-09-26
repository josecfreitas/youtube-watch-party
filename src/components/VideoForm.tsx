import { Box, Button, Input } from "@mui/material";
import { useEffect, useState } from "react";
import { extractVideoID } from "../util/extract-video-id";

interface Props {
  videoID?: string;
  setYoutubeVideoID: (videoID: string) => void;
}

export function VideoForm({ videoID, setYoutubeVideoID }: Props) {
  const [url, setURL] = useState("");
  const [isInvalidYoutubeURL, setIsInvalidYoutubeURL] = useState(false);

  useEffect(() => {
    if (videoID) {
      setURL(`https://www.youtube.com/watch?v=${videoID}`);
    } else {
      setURL("");
    }
  }, [videoID]);

  function isRemoveVideoID() {
    return !url && videoID;
  }

  function handleURLChange(event: any) {
    setIsInvalidYoutubeURL(false);
    setURL(event.target.value);
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const youtubeVideoID = extractVideoID(url);

    setIsInvalidYoutubeURL(false);

    if (isRemoveVideoID()) {
      console.log("Removing video from watch party");
      setYoutubeVideoID("");
    } else if (youtubeVideoID) {
      if (youtubeVideoID !== videoID) {
        console.log(`Updating video ID: ${youtubeVideoID}`);
        setYoutubeVideoID(youtubeVideoID);
      }
    } else {
      setIsInvalidYoutubeURL(true);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" gap="1rem">
        <Box flexGrow={1}>
          <Input
            value={url}
            onChange={handleURLChange}
            fullWidth
            error={isInvalidYoutubeURL}
          />
        </Box>
        <Button type="submit" variant="contained">
          {isRemoveVideoID() ? "Remove Video" : "Add Video"}
        </Button>
      </Box>
    </form>
  );
}
