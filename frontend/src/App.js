import axios from "axios";
import React, { useState } from "react";
import "./App.css";

function App() {
  const [players, setPlayers] = useState(["", "", "", "", "", ""]);
  const [assigned, setAssigned] = useState([]);

  const handleNameChange = (idx, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[idx] = value;
    setPlayers(updatedPlayers);
  };

  const assignCharacters = async () => {
    try {
      // First, update player names in the backend
      await axios.post(
        "http://localhost:8080/api/update-player-names",
        players
      );
      // Then, assign characters
      const response = await axios.post(
        "http://localhost:8080/api/assign-players",
        players
      );
      setAssigned(response.data);
    } catch (error) {
      setAssigned([{ name: "Error assigning characters" }]);
    }
  };

  return (
    <div className="App">
      <h2>Players:</h2>
      {players.map((player, idx) => (
        <div key={idx}>
          <input
            type="text"
            value={player}
            onChange={(e) => handleNameChange(idx, e.target.value)}
            placeholder={`Player ${idx + 1} name`}
          />
        </div>
      ))}
      <button onClick={assignCharacters}>Assign Characters</button>
      <h2>Assigned:</h2>
      {assigned.map((player, idx) => (
        <div key={idx}>
          {player.name} → {player.character?.name || "No character assigned"}
        </div>
      ))}
    </div>
  );
}

export default App;
