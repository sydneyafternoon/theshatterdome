import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/characters")
      .then((response) => setCharacters(response.data))
      .catch((error) => setCharacters([{ name: "Error connecting to backend" }]));
  }, []);

  return (
    <div className="App">
      {characters.map((char, idx) => (
        <div key={idx}>
          {char.name} | {char.characterClass} | Level: {char.level} | Health: {char.health} | Dexterity: {char.dexterity} | Strength: {char.strength} | Wisdom: {char.wisdom} | Wickedness: {char.wickedness} | Acuity: {char.acuity} | Faith: {char.faith}
        </div>
      ))}
    </div>
  );
}

export default App;