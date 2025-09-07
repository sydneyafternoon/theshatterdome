import React from "react";

function AssignedCharacters({ assigned, players, currentTurn, turnOrder }) {
  return (
    <div className="h-full overflow-y-auto">
      {assigned.length === 0 ? (
        <div className="space-y-2">
          {players.map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 px-3 border border-dashed border-muted-foreground/30 rounded"
            >
              <span className="text-muted-foreground">Player {idx + 1}</span>
              <span className="text-muted-foreground">
                No character assigned
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {assigned.map((player, idx) => {
            const isCurrentTurn =
              turnOrder &&
              turnOrder[currentTurn]?.character?.id === player.character?.id;
            return (
              <div
                key={idx}
                className={`p-4 rounded-lg shadow-sm ${
                  isCurrentTurn
                    ? "bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-600"
                    : "bg-gray-25 border border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className={`text-base font-bold ${
                        isCurrentTurn ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {player.character?.name || "No character assigned"}
                    </div>
                    <div
                      className={`text-sm mt-1 ${
                        isCurrentTurn ? "text-gray-700" : "text-gray-500"
                      }`}
                    >
                      {player.name}
                    </div>
                  </div>
                  {player.character?.health !== undefined &&
                    player.character?.fullHealth && (
                      <div className="text-right">
                        <div
                          className={`text-xs uppercase tracking-wide font-semibold ${
                            isCurrentTurn ? "text-gray-600" : "text-gray-500"
                          }`}
                        >
                          Health
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            isCurrentTurn ? "text-gray-800" : "text-gray-600"
                          }`}
                        >
                          {player.character.health}/
                          {player.character.fullHealth}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AssignedCharacters;
