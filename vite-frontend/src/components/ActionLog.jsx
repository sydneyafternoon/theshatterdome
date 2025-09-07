import React, { useEffect, useRef } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

function ActionLog({ actionLog }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [actionLog]);

  // Function to get spell type color
  const getSpellTypeColor = (spellType) => {
    switch (spellType) {
      case 1:
        return "text-red-500"; // Attack spells - red
      case 2:
        return "text-purple-500"; // Penalty spells - purple
      case 3:
        return "text-blue-500"; // Buff spells - blue
      case 4:
        return "text-green-500"; // Healing spells - green
      default:
        return "text-blue-400"; // Default - blue
    }
  };

  // Function to format action message with colors
  const formatActionMessage = (action) => {
    // Check if it's a spell casting message with type info
    const spellCastMatch = action.match(
      /^(.+) casted (.+) on (.+) \((successful|failed)\)\|(\d+)$/
    );
    if (spellCastMatch) {
      const [, caster, spellName, target, result, spellType] = spellCastMatch;
      const resultBgColor =
        result === "successful"
          ? "bg-green-200 text-green-800"
          : "bg-red-200 text-red-800";
      const spellColor = getSpellTypeColor(parseInt(spellType));

      return (
        <span>
          {caster} casted{" "}
          <span className={`font-semibold ${spellColor}`}>{spellName}</span> on{" "}
          {target}{" "}
          <span
            className={`px-1 py-0.5 rounded text-xs font-semibold ${resultBgColor}`}
          >
            {result}
          </span>
        </span>
      );
    }

    // Fallback: Check if it's a spell casting message without type info
    const fallbackMatch = action.match(
      /^(.+) casted (.+) on (.+) \((successful|failed)\)$/
    );
    if (fallbackMatch) {
      const [, caster, spellName, target, result] = fallbackMatch;
      const resultBgColor =
        result === "successful"
          ? "bg-green-200 text-green-800"
          : "bg-red-200 text-red-800";

      return (
        <span>
          {caster} casted{" "}
          <span className="font-semibold text-blue-400">{spellName}</span> on{" "}
          {target}{" "}
          <span
            className={`px-1 py-0.5 rounded text-xs font-semibold ${resultBgColor}`}
          >
            {result}
          </span>
        </span>
      );
    }

    // Check if it's a death message
    if (action.includes("was killed!")) {
      return <span className="text-red-600 font-semibold">{action}</span>;
    }

    // Default formatting
    return <span>{action}</span>;
  };

  return (
    <Card className="h-full max-h-[calc(100vh-8rem)] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <h2 className="text-xl font-semibold mb-2">Action Log</h2>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <div
          ref={scrollRef}
          className="max-h-full overflow-y-auto space-y-2 p-4"
        >
          {actionLog.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No actions taken yet
            </p>
          ) : (
            actionLog.map((entry, idx) => (
              <div key={idx} className="text-sm p-2 bg-muted/50 rounded">
                <div className="font-medium">
                  {formatActionMessage(entry.action)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {entry.timestamp}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ActionLog;
