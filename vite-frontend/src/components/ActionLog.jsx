import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

function ActionLog({ actionLog }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold mb-2">Action Log</h2>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto space-y-2">
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
