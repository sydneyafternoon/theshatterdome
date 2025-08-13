import axios from "axios";
import React, { useState } from "react";
import "./App.css";

import DesignChanneling from "./components/DesignChanneling";

function App() {
  const [players, setPlayers] = useState(["", "", "", "", "", ""]);
  const [assigned, setAssigned] = useState([]);
  const [turnOrder, setTurnOrder] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);

  const handleNameChange = (idx, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[idx] = value;
    setPlayers(updatedPlayers);
  };

  const assignCharacters = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/update-player-names",
        players
      );
      const response = await axios.post(
        "http://localhost:8080/api/assign-players",
        players
      );
      setAssigned(response.data);

      // Sort players by assigned character's dexterity (descending)
      const sorted = [...response.data].sort(
        (a, b) => (b.character?.dexterity || 0) - (a.character?.dexterity || 0)
      );
      setTurnOrder(sorted);
      setCurrentTurn(0);
    } catch (error) {
      setAssigned([{ name: "Error assigning characters" }]);
    }
  };

  const endTurn = () => {
    setCurrentTurn((prev) => (prev + 1) % turnOrder.length);
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
      {turnOrder.length > 0 && (
        <>
          <h2>Current Turn:</h2>
          <div>
            {turnOrder[currentTurn].name} (
            {turnOrder[currentTurn].character?.name}) - Dexterity:{" "}
            {turnOrder[currentTurn].character?.dexterity}
          </div>
          <button onClick={endTurn}>End Turn</button>
        </>
      )}
      <DesignChanneling />
    </div>
  );
}

export default App;
