import React, { useEffect, useRef } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

function ActionLog({ actionLog }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [actionLog]);

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
            <p className="text-muted-foreground text-sm">No actions taken yet</p>
          ) : (
            actionLog.slice(-15).map((entry, idx) => (
              <div key={idx} className="text-sm p-2 bg-muted/50 rounded">
                <div className="font-medium">{entry.action}</div>
                <div className="text-xs text-muted-foreground">{entry.timestamp}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ActionLog;
