import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const socket = io.connect("http://localhost:3001");

function App() {

  // local state to store room
  const [room, setRoom] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');

  // local state to store the user's message
  const [matchInfo, setMatchInfo] = useState({
    playerOneHp: 40,
    playerTwoHp: 40
  });
  
  const addP1Hp = () => {
    let p1Hp = matchInfo.playerOneHp;
    p1Hp ++;
    setMatchInfo({...matchInfo, playerOneHp: p1Hp });
    updateMatchInfo();
  }
  const minusP1Hp = () => {
    let p1Hp = matchInfo.playerOneHp;
    p1Hp --;
    setMatchInfo({...matchInfo, playerOneHp: p1Hp });
    updateMatchInfo();
  }

  const joinRoom = () => {
    setCurrentRoom(room);
    if(room !== "") {
      socket.emit("join_room", room);
    }
    const roomInput = document.getElementById("room_input");
    roomInput.value = ''
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
      <h1>Room: {currentRoom}</h1>
      <input
        id="room_input"
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}>Join Room</button>

      <h2>
        <button onClick={minusP1Hp}>-</button>
        Player One Hp: {matchInfo.playerOneHp}
        <button onClick={addP1Hp}>+</button>
      </h2>
      <br/>
      <h2>Player Two Hp: {matchInfo.playerTwoHp}</h2>
    </div>
  );
}

export default App;
