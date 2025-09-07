import React, { useState, useRef, useCallback } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef(null);

  const executeRestart = useCallback(async () => {
    try {
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
    } catch (error) {
      console.error("Restart failed:", error);
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  }, [
    setAssigned,
    setTurnOrder,
    setCurrentTurn,
    setPlayers,
    setGameOver,
    clearActionLog,
  ]);

  const startRestart = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    setProgress(0);

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2; // 2% every interval
        if (newProgress >= 100) {
          clearInterval(progressIntervalRef.current);
          executeRestart();
          return 100;
        }
        return newProgress;
      });
    }, 30); // Update every 30ms for smooth animation (1.5s total)
  }, [isLoading, executeRestart]);

  const stopRestart = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsLoading(false);
    setProgress(0);
  }, []);

  return (
    <Button
      onMouseDown={startRestart}
      onMouseUp={stopRestart}
      onMouseLeave={stopRestart}
      onTouchStart={startRestart}
      onTouchEnd={stopRestart}
      className="w-full mb-2 relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-sm transition-colors duration-200 border border-gray-300 hover:border-gray-400"
    >
      {/* Progress bar background */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 transition-all duration-75 ease-linear"
        style={{
          width: `${progress}%`,
          opacity: isLoading ? 0.8 : 0,
        }}
      />

      {/* Button text */}
      <span
        className={`relative transition-colors duration-150 ${
          isLoading && progress > 40 ? "text-white" : "text-gray-800"
        }`}
      >
        {isLoading ? (
          <>Hold to Restart ({Math.round(progress)}%)</>
        ) : (
          <>Restart Game</>
        )}
      </span>
    </Button>
  );
}

export default RestartGameButton;
