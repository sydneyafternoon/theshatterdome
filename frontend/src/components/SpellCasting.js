import React, { useState, useEffect } from "react";
import axios from "axios";

import { DesignChanneling } from "./DesignChanneling";

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
        setSelectedSpell(null);
        setSelectedTarget(null);
        setCurrentTurn(currentTurn + 1);
        return;
      }

      // Proceed with spell casting logic
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
      const targetCharId = targetPlayer.character.id;
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

      // Move to next turn
      let newTurn;
      if (
        updatedOrder.findIndex((p) => p.character.id === targetCharId) === -1 &&
        selectedTarget < currentTurn
      ) {
        newTurn = currentTurn;
      } else {
        newTurn = currentTurn + 1 >= updatedOrder.length ? 0 : currentTurn + 1;
      }

      setTurnOrder(updatedOrder);
      setAssigned(updatedOrder);
      setSelectedSpell(null);
      setSelectedTarget(null);
      setCurrentTurn(newTurn);
    }
  };

  if (!spells.length) return null;

  if (gameOver) {
    return (
      <div>
        <h2>Game Over!</h2>
        <p>{winner} won.</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Spells:</h3>
      {!selectedSpell &&
        spells.map((spell, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedSpell(spell)}
            style={{ marginRight: "8px" }}
          >
            {spell.name}
          </button>
        ))}
      {selectedSpell && (
        <div>
          <button
            onClick={() => setSelectedSpell(null)}
            style={{ marginBottom: "1em" }}
          >
            ← Back to Spells
          </button>
          <h4>Select Target:</h4>
          {turnOrder.map((player, idx) => {
            if (idx === currentTurn) return null;
            // Attack or penalty: type id 1 or 2 → different team
            if (
              (selectedSpell.type?.id === 1 || selectedSpell.type?.id === 2) &&
              player.character?.team !== currentPlayer.character?.team
            ) {
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedTarget(idx)}
                  style={{
                    marginRight: "8px",
                    background: selectedTarget === idx ? "#ddd" : "",
                  }}
                >
                  {player.name} ({player.character?.name}) | Health:{" "}
                  {player.character?.health}
                </button>
              );
            }
            // Heal: type id 4 → same team and not full health
            if (
              selectedSpell.type?.id === 4 &&
              player.character?.team === currentPlayer.character?.team &&
              player.character?.health < player.character?.fullHealth
            ) {
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedTarget(idx)}
                  style={{
                    marginRight: "8px",
                    background: selectedTarget === idx ? "#ddd" : "",
                  }}
                >
                  {player.name} ({player.character?.name}) | Health:{" "}
                  {player.character?.health}
                </button>
              );
            }
            // Bonus: type id 3 → same team (no health check)
            if (
              selectedSpell.type?.id === 3 &&
              player.character?.team === currentPlayer.character?.team
            ) {
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedTarget(idx)}
                  style={{
                    marginRight: "8px",
                    background: selectedTarget === idx ? "#ddd" : "",
                  }}
                >
                  {player.name} ({player.character?.name}) | Health:{" "}
                  {player.character?.health}
                </button>
              );
            }
            return null;
          })}

          {selectedTarget !== null && (
            <div>
              <button onClick={castSpell}>
                Cast {selectedSpell.name} on {turnOrder[selectedTarget].name}
              </button>
            </div>
          )}
        </div>
      )}

      {showChanneling && (
        <div
          style={{ marginTop: "1em", padding: "1em", border: "1px solid #ccc" }}
        >
          <div>
            <strong>Channeling Question:</strong>
            <div style={{ margin: "1em 0" }}>{question || "Loading..."}</div>
          </div>
          <button
            onClick={() => handleChannelingResponse(true)}
            style={{ marginRight: "1em" }}
          >
            OK
          </button>
          <button onClick={() => handleChannelingResponse(false)}>
            Not OK
          </button>
        </div>
      )}

      {/* Result message */}
      {channelingResult === "success" && (
        <div style={{ color: "green", marginTop: "1em" }}>Success!</div>
      )}
      {channelingResult === "failed" && (
        <div style={{ color: "red", marginTop: "1em" }}>Failed!</div>
      )}
    </div>
  );
}

export default SpellCasting;
