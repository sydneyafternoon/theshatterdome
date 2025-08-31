import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DesignChanneling } from "./DesignChanneling.jsx";

function SpellCasting({
  turnOrder,
  currentTurn,
  setTurnOrder,
  setAssigned,
  setCurrentTurn,
  gameOver,
  setGameOver,
}) {
  const [spells, setSpells] = useState([]);
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [winner, setWinner] = useState(null);
  const [question, setQuestion] = useState("");
  const [showChanneling, setShowChanneling] = useState(false);
  const [channelingResult, setChannelingResult] = useState(""); // "success" or "failed"

  const currentPlayer = turnOrder[currentTurn];

  useEffect(() => {
    if (currentPlayer?.character?.id) {
      axios
        .get(`http://localhost:8080/api/spells/${currentPlayer.character.id}`)
        .then((res) => {
          console.log("Fetched spells:", res.data); // Add this line
          setSpells(res.data);
        })
        .catch(() => setSpells([]));
    }
  }, [currentPlayer]);

  // Prevent back button from retaining after entering new turn
  useEffect(() => {
    setSelectedSpell(null);
    setSelectedTarget(null);
    setChannelingResult("");
  }, [currentTurn]);

  const castSpell = async () => {
    if (selectedSpell && selectedTarget !== null) {
      setQuestion("");
      setShowChanneling(true);
      setChannelingResult("");
      const question = await DesignChanneling();
      setQuestion(question);
    }
  };

  const handleChannelingResponse = async (isOk) => {
    if (selectedSpell && selectedTarget !== null) {
      setShowChanneling(false);
      if (!isOk) {
        setChannelingResult("failed");
        setTimeout(() => {
          setSelectedSpell(null);
          setSelectedTarget(null);
          setChannelingResult("");
          setCurrentTurn(
            currentTurn + 1 >= turnOrder.length ? 0 : currentTurn + 1
          );
        }, 1000);
        return;
      }

      // Proceed with spell casting logic
      setChannelingResult("success");
      const targetPlayer = turnOrder[selectedTarget];
      let healthChange = 0;
      let statusUpdate = null;

      if (selectedSpell.type?.id === 1) {
        healthChange = -1;
      } else if (selectedSpell.type?.id === 4) {
        healthChange = 1;
      } else if (selectedSpell.type?.id === 2) {
        statusUpdate = 1;
      } else if (selectedSpell.type?.id === 3) {
        statusUpdate = 2;
      }

      const newHealth = targetPlayer.character.health + healthChange;

      try {
        // Persist health change if applicable
        if (selectedSpell.type?.id === 1 || selectedSpell.type?.id === 4) {
          await axios.put(
            `http://localhost:8080/api/character/${targetPlayer.character.id}/health`,
            newHealth,
            { headers: { "Content-Type": "application/json" } }
          );
        }
        // Persist status change if applicable
        if (statusUpdate !== null) {
          await axios.put(
            `http://localhost:8080/api/character/${targetPlayer.character.id}/status`,
            statusUpdate,
            { headers: { "Content-Type": "application/json" } }
          );
        }
      } catch (error) {
        console.error("Failed to update character:", error);
        alert("Failed to update character. Please try again.");
      }

      let updatedOrder = turnOrder.map((player, idx) => {
        if (idx === selectedTarget) {
          return {
            ...player,
            character: {
              ...player.character,
              health:
                selectedSpell.type?.id === 1 || selectedSpell.type?.id === 4
                  ? newHealth
                  : player.character.health,
              status:
                statusUpdate !== null ? statusUpdate : player.character.status,
            },
          };
        }
        return player;
      });

      // Remove players whose health is <= 0
      updatedOrder = updatedOrder.filter(
        (player) => player.character.health > 0
      );

      // Check if only one team remains
      const remainingTeams = [
        ...new Set(updatedOrder.map((player) => player.character.team)),
      ];
      if (remainingTeams.length === 1) {
        setGameOver(true);
        setWinner(remainingTeams[0]);
        setAssigned(updatedOrder);
        return;
      }

      // Move to next turn after 1 second
      const newCurrentIndex = updatedOrder.findIndex(p => p.character.id === currentPlayer.character.id);
      let newTurn;
      if (newCurrentIndex === -1) {
        // Current player was removed (shouldn't happen, but safety)
        newTurn = 0;
      } else {
        newTurn = (newCurrentIndex + 1) % updatedOrder.length;
      }

      setTurnOrder(updatedOrder);
      setAssigned(updatedOrder);
      setSelectedSpell(null);
      setSelectedTarget(null);
      setCurrentTurn(newTurn);
      setTimeout(() => {
        setChannelingResult("");
      }, 1000);
    }
  };

  if (!spells.length) return null;

  if (gameOver) {
    return (
      <div className="w-full max-w-xl mx-auto my-4 p-6 border border-gray-200 rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-4">Game Over!</h2>
        <p className="text-center text-lg">{winner} won.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <h3 className="text-xl font-semibold mb-4">Spells</h3>
      {!selectedSpell && (
        <div className="flex flex-wrap gap-2 mb-4">
          {spells.map((spell, idx) => (
            <Button
              key={idx}
              variant="outline"
              onClick={() => setSelectedSpell(spell)}
            >
              {spell.name}
            </Button>
          ))}
        </div>
      )}
      {selectedSpell && (
        <div className="mb-4">
          <Button variant="ghost" onClick={() => setSelectedSpell(null)} className="mb-2">
            ← Back to Spells
          </Button>
          <h4 className="font-medium mb-2">Select Target:</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {turnOrder.map((player, idx) => {
              if (idx === currentTurn) return null;
              // Attack or penalty: type id 1 or 2 → different team
              if (
                (selectedSpell.type?.id === 1 || selectedSpell.type?.id === 2) &&
                player.character?.team !== currentPlayer.character?.team
              ) {
                return (
                  <Button
                    key={idx}
                    variant={selectedTarget === idx ? "default" : "outline"}
                    onClick={() => setSelectedTarget(idx)}
                  >
                    {player.name} ({player.character?.name}) | Health: {player.character?.health}
                  </Button>
                );
              }
              // Heal: type id 4 → same team and not full health
              if (
                selectedSpell.type?.id === 4 &&
                player.character?.team === currentPlayer.character?.team &&
                player.character?.health < player.character?.fullHealth
              ) {
                return (
                  <Button
                    key={idx}
                    variant={selectedTarget === idx ? "default" : "outline"}
                    onClick={() => setSelectedTarget(idx)}
                  >
                    {player.name} ({player.character?.name}) | Health: {player.character?.health}
                  </Button>
                );
              }
              // Bonus: type id 3 → same team (no health check)
              if (
                selectedSpell.type?.id === 3 &&
                player.character?.team === currentPlayer.character?.team
              ) {
                return (
                  <Button
                    key={idx}
                    variant={selectedTarget === idx ? "default" : "outline"}
                    onClick={() => setSelectedTarget(idx)}
                  >
                    {player.name} ({player.character?.name}) | Health: {player.character?.health}
                  </Button>
                );
              }
              return null;
            })}
          </div>
          {selectedTarget !== null && (
            <Button onClick={castSpell} className="w-full">
              Cast {selectedSpell.name} on {turnOrder[selectedTarget].name}
            </Button>
          )}
        </div>
      )}

      {showChanneling && (
        <div className="mt-4 p-4 border rounded bg-muted">
          <div className="font-semibold mb-2">Channeling Question:</div>
          <div className="mb-4">{question || "Loading..."}</div>
          <div className="flex gap-2">
            <Button onClick={() => handleChannelingResponse(true)}>
              OK
            </Button>
            <Button variant="outline" onClick={() => handleChannelingResponse(false)}>
              Not OK
            </Button>
          </div>
        </div>
      )}

      {/* Result message */}
      {channelingResult === "success" && (
        <div className="text-green-600 font-semibold mt-4">Success!</div>
      )}
      {channelingResult === "failed" && (
        <div className="text-red-600 font-semibold mt-4">Failed!</div>
      )}
    </div>
  );
}

export default SpellCasting;
