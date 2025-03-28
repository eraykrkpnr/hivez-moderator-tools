"use client";

import React, { useState } from "react";
import "./TeamSelector.css"; // CSS dosyasını ekleyin

function TeamGenerator() {
  const [names, setNames] = useState([]);
  const [teamCount, setTeamCount] = useState(2); // Default team count
  const [teams, setTeams] = useState([]);

  const addName = (event) => {
    event.preventDefault();
    const nameInput = event.target.elements.name.value;
    if (nameInput) {
      setNames([...names, nameInput]);
      event.target.reset();
    }
  };

  const generateTeams = () => {
    const shuffledNames = [...names].sort(() => 0.5 - Math.random());
    const tempTeams = Array.from({ length: teamCount }, () => []);

    shuffledNames.forEach((name, index) => {
      tempTeams[index % teamCount].push(name);
    });

    setTeams(tempTeams);
  };

  return (
    <div className="team-generator-container">
      <div className="column">
        <h2>Takım oluşturma</h2>
        <form onSubmit={addName}>
          <input
            type="text"
            name="name"
            placeholder="İsim gir"
            className="name-input"
            required
          />
          <button type="submit">İsim ekle</button>
        </form>

        <div className="added-names">
          <h3>Eklenen isimler:</h3>
          <ul>
            {names.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>

        <input
          type="number"
          min="2"
          value={teamCount}
          onChange={(e) => setTeamCount(Number(e.target.value))}
          placeholder="Takım sayısı"
        />

        <div className="buttons">
          <button onClick={generateTeams}>Takım oluştur</button>
        </div>
      </div>

      <div className="column">
        <div className="generated-teams">
          <h3>Oluşturulan takım:</h3>
          {teams.map((team, index) => (
            <div key={index}>
              <h4>Team {index + 1}</h4>
              <ul>
                {team.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeamGenerator;
