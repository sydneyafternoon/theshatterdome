import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/hello")
      .then((response) => setMessage(response.data))
      .catch((error) => setMessage("Error connecting to backend"));
  }, []);

  return <div className="App">{message}</div>;
}

export default App;
