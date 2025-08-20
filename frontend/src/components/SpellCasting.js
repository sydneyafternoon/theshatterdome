import React, { useState, useEffect } from "react";
import axios from "axios";

function SpellCasting({
  turnOrder,
  currentTurn,
  setTurnOrder,
  setAssigned,
  setCurrentTurn,
}) {
  const [spells, setSpells] = useState([]);
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);

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

  const castSpell = async () => {
    if (selectedSpell && selectedTarget !== null) {
      const targetPlayer = turnOrder[selectedTarget];
      let healthChange = 0;
      if (selectedSpell.type?.id === 1) {
        healthChange = -1;
      } else if (selectedSpell.type?.id === 4) {
        healthChange = 1;
      }

      const newHealth = targetPlayer.character.health + healthChange;

      try {
        // Persist the health change in the backend
        await axios.put(
          `http://localhost:8080/api/character/${targetPlayer.character.id}/health`,
          newHealth, // this is a JS number, which Axios will send as JSON
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Failed to update health:", error);
        alert("Failed to update health. Please try again.");
      }

      const updatedOrder = turnOrder.map((player, idx) => {
        if (idx === selectedTarget) {
          return {
            ...player,
            character: {
              ...player.character,
              health: newHealth,
            },
          };
        }
        return player;
      });
      setTurnOrder(updatedOrder);
      setAssigned(updatedOrder);
      setSelectedSpell(null);
      setSelectedTarget(null);
      setCurrentTurn((prev) => (prev + 1) % turnOrder.length);
    }
  };

  if (!spells.length) return null;

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
              player.character?.health < player.character?.full_health
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
    </div>
  );
}

export default SpellCasting;
