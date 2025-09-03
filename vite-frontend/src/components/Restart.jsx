import React from "react";
import axios from "axios";
import { Button } from "./ui/button";

function RestartGameButton({
  setAssigned,
  setTurnOrder,
  setCurrentTurn,
  setPlayers,
  setGameOver,
  clearActionLog,
}) {
  const handleRestart = async () => {
    // Reset all characters' health and status in backend
    await axios.put("http://localhost:8080/api/characters/reset");
    // Reset all player assignments in backend
    await axios.put("http://localhost:8080/api/players/reset");

    // Reset frontend state
    setAssigned([]);
    setTurnOrder([]);
    setCurrentTurn(0);
    setPlayers(["", "", "", "", "", ""]);
    setGameOver(false);
    clearActionLog();
  };

  return (
    <Button
      onClick={handleRestart}
      variant="secondary"
      className="w-full my-2 transition-transform duration-150 hover:scale-100 active:scale-95 hover:bg-secondary/70 active:bg-secondary/80"
    >
      Restart Game
    </Button>
  );
}

export default RestartGameButton;
