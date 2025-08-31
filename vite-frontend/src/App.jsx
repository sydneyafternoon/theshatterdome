import axios from "axios";
import React, { useState } from "react";
import "./App.css";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SpellCasting from "./components/SpellCasting.jsx";
import RestartGame from "./components/Restart.jsx";

function App() {
  const [players, setPlayers] = useState(["", "", "", "", "", ""]);
  const [assigned, setAssigned] = useState([]);
  const [turnOrder, setTurnOrder] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [gameOver, setGameOver] = useState(false);

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
      setAssigned([{ name: error.message }]);
    }
  };

  const endTurn = () => {
    setCurrentTurn((prev) => (prev + 1) % turnOrder.length);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-xl mb-6">
        <CardHeader>
          <h2 className="text-2xl font-bold mb-2">Players</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {players.map((player, idx) => (
              <Input
                key={idx}
                value={player}
                onChange={(e) => handleNameChange(idx, e.target.value)}
                placeholder={`Player ${idx + 1} name`}
                className=""
              />
            ))}
          </div>
          <Button
            onClick={assignCharacters}
            className="w-full mb-2 transition-transform duration-150 hover:scale-100 active:scale-95"
          >
            Assign Characters
          </Button>
          <RestartGame
            setAssigned={setAssigned}
            setTurnOrder={setTurnOrder}
            setCurrentTurn={setCurrentTurn}
            setPlayers={setPlayers}
            setGameOver={setGameOver}
          />
        </CardContent>
      </Card>

      <Card className="w-full max-w-xl mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold mb-2">Assigned Characters</h2>
        </CardHeader>
        <CardContent>
          {assigned.length === 0 ? (
            <div className="text-muted-foreground">
              No characters assigned yet.
            </div>
          ) : (
            assigned.map((player, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1 border-b last:border-b-0"
              >
                <span className="font-medium">{player.name}</span>
                <span className="ml-2">
                  {player.character?.name || "No character assigned"}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {turnOrder.length > 0 && (
        <Card className="w-full max-w-xl mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold mb-2">Current Turn</h2>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-2 rounded bg-card text-card-foreground">
              <span className="font-bold">{turnOrder[currentTurn].name}</span> (
              {turnOrder[currentTurn].character?.name}) - Dexterity:{" "}
              {turnOrder[currentTurn].character?.dexterity}
            </div>
            <SpellCasting
              turnOrder={turnOrder}
              currentTurn={currentTurn}
              setTurnOrder={setTurnOrder}
              setAssigned={setAssigned}
              setCurrentTurn={setCurrentTurn}
              gameOver={gameOver}
              setGameOver={setGameOver}
            />
            {!gameOver && (
              <Button onClick={endTurn} className="mt-4 w-full">
                End Turn
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default App;
