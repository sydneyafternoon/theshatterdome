import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

function AssignedCharacters({ assigned, players }) {
  return (
    <Card className="h-full max-h-10/12 flex flex-col">
      <CardHeader className="flex-shrink-0">
        <h2 className="text-xl font-semibold mb-2">
          Assigned Characters
        </h2>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {assigned.length === 0 ? (
          <div className="space-y-2">
            {players.map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 px-3 border border-dashed border-muted-foreground/30 rounded"
              >
                <span className="text-muted-foreground">
                  Player {idx + 1}
                </span>
                <span className="text-muted-foreground">
                  No character assigned
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {assigned.map((player, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 px-3 border-b last:border-b-0"
              >
                <span className="font-medium">{player.name}</span>
                <span className="ml-2">
                  {player.character?.name || "No character assigned"}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AssignedCharacters;
