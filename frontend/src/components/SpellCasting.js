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

  const castSpell = () => {
    if (selectedSpell && selectedTarget !== null) {
      const updatedOrder = turnOrder.map((player, idx) => {
        if (idx === selectedTarget) {
          return {
            ...player,
            character: {
              ...player.character,
              health: player.character.health - 1,
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
      {spells.map((spell, idx) => (
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
            // Bonus or heal: type id 3 or 4 → same team
            if (
              (selectedSpell.type?.id === 3 || selectedSpell.type?.id === 4) &&
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
