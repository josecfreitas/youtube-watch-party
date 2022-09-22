import React from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "@mui/material/Button";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase/firebase-config";
import { useWatchRoom } from "./hooks/use-watch-room";

initializeApp(firebaseConfig);

// randomly generate a user ID every time you join the room
// you don't need persistence between browser reloads or different sessions,
// so a random ID will do to distinguish between two tabs with the Youtube Watch Party Open
const USER_ID = uuidv4();

function App() {
  const { 
    watchRoom,
    setYoutubeVideo,
    setVideoStatus,
    setVideoTime
  } = useWatchRoom();

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome to the Youtube Watch Party. Your ID for this session is{" "}
          {USER_ID}.
        </p>
        <Button>Add a youtube video</Button>
      </header>
    </div>
  );
}

export default App;
