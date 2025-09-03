import { useState } from "react";

export function useActionLog() {
  const [actionLog, setActionLog] = useState([]);

  const addAction = (action) => {
    const timestamp = new Date().toLocaleTimeString();
    setActionLog((prev) => [...prev, { action, timestamp }]);
  };

  const clearActionLog = () => {
    setActionLog([]);
  };

  return {
    actionLog,
    addAction,
    clearActionLog,
  };
}
