import { v4 as uuidv4 } from "uuid";

import { Box, Button, Container, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { Loading } from "../components/Loading";
import { VideoForm } from "../components/VideoForm";
import { YoutubePlayer } from "../components/YoutubePlayer";
import { useWatchRoom } from "../hooks/use-watch-room";

interface Props {
  userID: string;
}

export function WatchRoom({ userID }: Props) {
  const { id } = useParams();

  const { watchRoom, setYoutubeVideo, updateVideoStatus, updateVideoTime } =
    useWatchRoom(id);

  if (!watchRoom) return <Loading />;

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      gap="1rem"
      bgcolor="#8EC5FC"
      style={{
        backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)",
      }}
    >
      <Box component="header">
        <Container>
          <Box margin="2rem 0 1rem">
            <VideoForm
              videoID={watchRoom.youtubeVideoID}
              setYoutubeVideoID={(videoID) => setYoutubeVideo(videoID, userID)}
            />
          </Box>
        </Container>
      </Box>

      <Box flexGrow={1} component="main" alignSelf="center">
        <Container>
          <YoutubePlayer
            watchRoom={watchRoom}
            userID={userID}
            updateVideoStatus={updateVideoStatus}
            updateVideoTime={updateVideoTime}
          />
        </Container>
      </Box>

      <Box alignSelf="center">
        <Button component={Link} to={uuidv4()} variant="contained">
          New Private Room
        </Button>
      </Box>

      <Box component="footer" padding="1rem 0 2rem">
        <Container>
          <Typography textAlign="center" variant="body2" component="p">
            Welcome to the Youtube Watch Party. Your ID for this session is{" "}
            {userID}.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
