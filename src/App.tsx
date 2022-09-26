import { v4 as uuidv4 } from "uuid";

import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { initializeApp } from "firebase/app";
import { VideoForm } from "./components/VideoForm";
import { YoutubePLayer } from "./components/YoutubePlayer";
import { firebaseConfig } from "./firebase/firebase-config";
import { useWatchRoom } from "./hooks/use-watch-room";
import { Loading } from "./components/Loading";

initializeApp(firebaseConfig);

// randomly generate a user ID every time you join the room
// you don't need persistence between browser reloads or different sessions,
// so a random ID will do to distinguish between two tabs with the Youtube Watch Party Open
const USER_ID = uuidv4();

function App() {
  const { watchRoom, setYoutubeVideo, setVideoStatus, setVideoTime } =
    useWatchRoom();

  if (!watchRoom) return <Loading />;

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      gap="1rem"
    >
      <Box component="header">
        <Container>
          <Box margin="2rem 0 1rem">
            <VideoForm
              videoID={watchRoom.youtubeVideoID}
              setYoutubeVideoID={setYoutubeVideo}
            />
          </Box>
        </Container>
      </Box>

      <Box flexGrow={1} component="main" alignSelf='center'>
        <Container>
          <YoutubePLayer videoId={watchRoom.youtubeVideoID} />
        </Container>
      </Box>

      <Box component="footer" padding="1rem 0 2rem">
        <Container>
          <Typography textAlign='center' variant="body2" component="p">
            Welcome to the Youtube Watch Party. Your ID for this session is{" "}
            {USER_ID}.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
