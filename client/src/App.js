import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const socket = io.connect("http://localhost:3001");

function App() {

  // local state to store room
  const [room, setRoom] = useState('');

  // local state to store the user's message
  const [matchInfo, setMatchInfo] = useState({
    playerOneHp: 40,
    PlayerTwoHp: 40
  });
  

  const joinRoom = () => {
    if(room !== "") {
      socket.emit("join_room", room);
    }
  };

  // Emit a message to the backend server
  const updateMatchInfo = () => {
    socket.emit("update_match_info", {matchInfo, room})
  };

  useEffect(() => {
    socket.on("receive_match_info", (data) => {
      setMatchInfo(data.matchInfo);
    })
  }, [socket])


  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}>Join Room</button>
      <input
        type="number"
        onChange={(event) => {
          setMatchInfo({...matchInfo, playerOneHp: event.target.value});
          updateMatchInfo();
        }}
      />
      <input
        type="number"
        onChange={(event) => {
          setMatchInfo({...matchInfo, playerTwoHp: event.target.value});
          updateMatchInfo();
        }}
      />
      <h2>Player One Hp: {matchInfo.playerOneHp}</h2>
      <h2>Player Two Hp: {matchInfo.playerTwoHp}</h2>
    </div>
  );
}

export default App;
