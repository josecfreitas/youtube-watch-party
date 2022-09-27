import { v4 as uuidv4 } from "uuid";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase/firebase-config";
import { WatchRoom } from "./pages/watch-room";

import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

initializeApp(firebaseConfig);

// randomly generate a user ID every time you join the room
// you don't need persistence between browser reloads or different sessions,
// so a random ID will do to distinguish between two tabs with the Youtube Watch Party Open
const USER_ID = uuidv4();

function App() {
  const { id } = useParams();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WatchRoom userID={USER_ID} />}>
          <Route path="/:id" element={<WatchRoom userID={USER_ID} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
