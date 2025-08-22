import React from "react";
import axios from "axios";

function RestartGameButton({
  setAssigned,
  setTurnOrder,
  setCurrentTurn,
  setPlayers,
}) {
  const handleRestart = async () => {
    // Reset all characters' health and status in backend
    await axios.put("http://localhost:8080/api/characters/reset");

    // Reset frontend state
    setAssigned([]);
    setTurnOrder([]);
    setCurrentTurn(0);
    setPlayers(["", "", "", "", "", ""]);
  };

  return (
    <button onClick={handleRestart} style={{ margin: "1em 0" }}>
      Restart Game
    </button>
  );
}

export default RestartGameButton;
