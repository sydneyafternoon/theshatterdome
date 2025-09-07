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
  setGameOver,
  setWinner,
  addAction,
  onTurnEnd,
}) {
  const [spells, setSpells] = useState([]);
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [question, setQuestion] = useState("");
  const [showChanneling, setShowChanneling] = useState(false);
  const [channelingResult, setChannelingResult] = useState(""); // "success" or "failed"

  const currentPlayer = turnOrder[currentTurn];

  // Function to get spell type color for buttons
  const getSpellButtonColor = (spellType, isSelected = false) => {
    if (isSelected) {
      switch (spellType) {
        case 1:
          return "bg-red-500 border-red-500 text-red-100 hover:bg-red-600 hover:text-white"; // Attack spells - selected
        case 2:
          return "bg-purple-500 border-purple-500 text-purple-100 hover:bg-purple-600 hover:text-white"; // Penalty spells - selected
        case 3:
          return "bg-blue-500 border-blue-500 text-blue-100 hover:bg-blue-600 hover:text-white"; // Buff spells - selected
        case 4:
          return "bg-green-500 border-green-500 text-green-100 hover:bg-green-600 hover:text-white"; // Healing spells - selected
        default:
          return ""; // Default styling
      }
    } else {
      switch (spellType) {
        case 1:
          return "bg-red-100 border-red-500 text-red-700 hover:bg-red-200 hover:text-red-800"; // Attack spells - unselected
        case 2:
          return "bg-purple-100 border-purple-500 text-purple-700 hover:bg-purple-200 hover:text-purple-800"; // Penalty spells - unselected
        case 3:
          return "bg-blue-100 border-blue-500 text-blue-700 hover:bg-blue-200 hover:text-blue-800"; // Buff spells - unselected
        case 4:
          return "bg-green-100 border-green-500 text-green-700 hover:bg-green-200 hover:text-green-800"; // Healing spells - unselected
        default:
          return ""; // Default styling
      }
    }
  };

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
    // If channeling is active when turn changes, animate collapse first
    if (showChanneling) {
      setShowChanneling(false);
      // Wait for collapse animation to finish before clearing other states
      setTimeout(() => {
        setSelectedSpell(null);
        setSelectedTarget(null);
        setChannelingResult("");
      }, 500); // Match the duration-500 transition time
    } else {
      setSelectedSpell(null);
      setSelectedTarget(null);
      setChannelingResult("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTurn]); // Only depend on currentTurn to avoid infinite loop

  const castSpell = async () => {
    if (selectedSpell && selectedTarget !== null) {
      setQuestion("");
      setShowChanneling(true);
      setChannelingResult("");
      // const question = await DesignChanneling();
      // setQuestion(question);
      setQuestion("this is a dummy question");
    }
  };

  const handleChannelingResponse = async (isOk) => {
    if (selectedSpell && selectedTarget !== null) {
      if (!isOk) {
        setChannelingResult("failed");
        addAction(
          `${currentPlayer.name} casted ${selectedSpell.name} on ${turnOrder[selectedTarget].name} (failed)|${selectedSpell.type?.id}`
        );
        setTimeout(() => {
          setShowChanneling(false);
          setSelectedSpell(null);
          setSelectedTarget(null);
          setChannelingResult("");
          onTurnEnd(true); // Advance turn for failed spell
        }, 2000); // Show failed result for 2 seconds before collapsing
        return;
      }

      // Proceed with spell casting logic
      setChannelingResult("success");
      const targetPlayer = turnOrder[selectedTarget];

      // Log the successful spell cast with combined message
      addAction(
        `${currentPlayer.name} casted ${selectedSpell.name} on ${targetPlayer.name} (successful)|${selectedSpell.type?.id}`
      );

      // Store spell effects for later application
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

      // Apply spell effects after showing success message
      setTimeout(async () => {
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
                  statusUpdate !== null
                    ? statusUpdate
                    : player.character.status,
              },
            };
          }
          return player;
        });

        // Check for character death and report it
        const targetWasDead = targetPlayer.character.health <= 0;
        const targetIsNowDead = newHealth <= 0 && !targetWasDead;
        if (targetIsNowDead) {
          addAction(
            `${targetPlayer.name} (${targetPlayer.character.name}) was killed!`
          );
        }

        // Keep all players but identify living ones for game logic
        const livingPlayers = updatedOrder.filter(
          (player) => player.character.health > 0
        );

        // Check if only one team remains among living players
        const remainingTeams = [
          ...new Set(livingPlayers.map((player) => player.character.team)),
        ];
        if (remainingTeams.length === 1) {
          setGameOver(true);
          setWinner(remainingTeams[0]);
          setAssigned(updatedOrder); // Keep all players including dead ones
          return;
        }

        // Move to next living player's turn
        let newTurn = currentTurn;
        do {
          newTurn = (newTurn + 1) % updatedOrder.length;
        } while (updatedOrder[newTurn].character.health <= 0);

        setTurnOrder(updatedOrder); // Keep all players including dead ones
        setAssigned(updatedOrder); // Keep all players including dead ones
        setShowChanneling(false); // Collapse the card after everything is done
        setSelectedSpell(null);
        setSelectedTarget(null);
        setCurrentTurn(newTurn);
        setChannelingResult("");
        onTurnEnd(false); // Don't advance turn (already advanced manually)
      }, 2000); // Show success result for 2 seconds before continuing
    }
  };

  if (!spells.length) return null;

  return (
    <div className="w-full max-w-xl mx-auto mb-4">
      {/* Question section - shows as line when inactive, expands to card when active */}
      <div className="mb-4">
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showChanneling ? "max-h-96 opacity-100" : "max-h-1 opacity-100"
          }`}
        >
          {showChanneling ? (
            <div className="p-4 border rounded bg-muted">
              <div className="font-semibold mb-2">Channeling Question:</div>
              <div className="mb-4">{question || "Loading..."}</div>
              <div className="flex gap-2 mb-4">
                <Button onClick={() => handleChannelingResponse(true)}>
                  OK
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleChannelingResponse(false)}
                >
                  Not OK
                </Button>
              </div>

              {/* Result section within the expanded area */}
              {channelingResult === "success" && (
                <div className="p-3 bg-green-100 border border-green-300 rounded-md text-green-800 font-semibold text-center">
                  Success!
                </div>
              )}
              {channelingResult === "failed" && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-800 font-semibold text-center">
                  Failed!
                </div>
              )}
              {!channelingResult && (
                <div className="p-3 bg-gray-100 border border-gray-300 rounded-md text-gray-600 text-center">
                  Casting...
                </div>
              )}
            </div>
          ) : (
            <div className="h-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-300"></div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {[...Array(4)].map((_, idx) => {
          const spell = spells[idx];
          if (spell) {
            const isSelected = selectedSpell?.id === spell.id;
            return (
              <Button
                key={idx}
                variant="outline"
                onClick={() => setSelectedSpell(spell)}
                className={`h-12 text-sm ${getSpellButtonColor(
                  spell.type?.id,
                  isSelected
                )}`}
              >
                <span className="truncate px-1">{spell.name}</span>
              </Button>
            );
          } else {
            return (
              <div
                key={idx}
                className="h-12 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50"
              >
                <span className="text-gray-400 text-sm">Empty Slot</span>
              </div>
            );
          }
        })}
      </div>
      <div className="mb-4">
        <div className="grid grid-cols-1 gap-2 mb-2">
          {[...Array(5)].map((_, idx) => {
            // Find the player at this index (excluding current player)
            const availablePlayers = turnOrder.filter(
              (_, playerIdx) => playerIdx !== currentTurn
            );
            const player = availablePlayers[idx];

            if (!player) {
              // Empty slot
              return (
                <div
                  key={idx}
                  className="h-10 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50"
                >
                  <span className="text-gray-400 text-sm">Empty Slot</span>
                </div>
              );
            }

            const playerIndex = turnOrder.findIndex((p) => p === player);
            let isValidTarget = false;
            let isDisabled = !selectedSpell;

            // Dead characters cannot be targeted
            if (player.character?.health <= 0) {
              isValidTarget = false;
              isDisabled = true;
            } else if (selectedSpell) {
              // Attack or penalty: type id 1 or 2 → different team
              if (
                (selectedSpell.type?.id === 1 ||
                  selectedSpell.type?.id === 2) &&
                player.character?.team !== currentPlayer.character?.team
              ) {
                isValidTarget = true;
              }
              // Heal: type id 4 → same team and not full health
              else if (
                selectedSpell.type?.id === 4 &&
                player.character?.team === currentPlayer.character?.team &&
                player.character?.health < player.character?.fullHealth
              ) {
                isValidTarget = true;
              }
              // Bonus: type id 3 → same team (no health check)
              else if (
                selectedSpell.type?.id === 3 &&
                player.character?.team === currentPlayer.character?.team
              ) {
                isValidTarget = true;
              }
            }

            const buttonClasses =
              isDisabled || !isValidTarget
                ? "opacity-50 cursor-not-allowed"
                : "";

            return (
              <Button
                key={idx}
                variant={selectedTarget === playerIndex ? "default" : "outline"}
                onClick={() => {
                  if (!isDisabled && isValidTarget) {
                    setSelectedTarget(playerIndex);
                  }
                }}
                disabled={isDisabled || !isValidTarget}
                className={`h-10 text-sm ${buttonClasses}`}
              >
                {player.character?.name}
              </Button>
            );
          })}
        </div>
        <Button
          onClick={castSpell}
          className="w-full mt-3"
          disabled={!selectedSpell || selectedTarget === null}
        >
          {selectedSpell && selectedTarget !== null
            ? `Cast ${selectedSpell.name}`
            : "Cast Spell"}
        </Button>

        {/* Skip Turn Button - always available */}
        <Button
          onClick={() => {
            addAction(`${currentPlayer.name} skipped their turn`);

            // Move to next living player's turn (same logic as spell casting)
            let newTurn = currentTurn;
            do {
              newTurn = (newTurn + 1) % turnOrder.length;
            } while (turnOrder[newTurn].character.health <= 0);

            setCurrentTurn(newTurn);
            onTurnEnd(false); // Don't use automatic turn advancement since we handled it manually
          }}
          variant="outline"
          className="w-full mt-2 bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Skip Turn
        </Button>
      </div>
    </div>
  );
}

export default SpellCasting;
