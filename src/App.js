import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [room, setRoom] = useState("");

  const joinRoom = () => {
    if (username !== "") {
      socket.emit("join_room");
    }
  };

  socket.on("room_joined", (data) => {
    if (data.success) {
      setRoom(data.room);
      setShowChat(true);
    }
  });

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>За амжилт бро 💌 </h3>
          <input
            type="text"
            placeholder="Нэр"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Чатлах</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
       <footer className="footer">
        <p></p>
        <p>&copy; {new Date().getFullYear()} Powered by Wix Wie.</p>
      </footer>
    </div>
  );
}

export default App;
