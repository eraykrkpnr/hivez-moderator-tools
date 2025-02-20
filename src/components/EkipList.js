"use client";

import React, { useState,useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { db, ref, push, set,remove, onValue } from "../firebase"; // adjust path
import "./EkipList.css";

const gameOptions = [
  { value: "IRL", label: "IRL" },
  { value: "Goose Goose Duck", label: "Goose Goose Duck" },
  { value: "Feign", label: "Feign" },
  { value: "Lockdown Protocol", label: "Lockdown Protocol" },
  { value: "Dale & Dawson", label: "Dale & Dawson" },
  { value: "Among Us", label: "Among Us" },
  // Add more game options as needed
];

function EkipList() {
  const [names, setNames] = useState([
    { name: "H1vezZz", selected: true, uncertain: false },
    { name: "Unicorn (Burcu)", selected: false, uncertain: false },
    { name: "Sado_Mi (Sadullah Abi)", selected: false, uncertain: false },
    { name: "FiltreKaffe (Esra)", selected: false, uncertain: false },
    { name: "13th (Oğuz)", selected: false, uncertain: false },
    { name: "Watson", selected: false, uncertain: false },
    { name: "Solitude (Arif)", selected: false, uncertain: false },
    { name: "Nieve (Berfin)", selected: false, uncertain: false },
    { name: "Ecedeggy (Arda)", selected: false, uncertain: false },
    { name: "anilcakirr", selected: false, uncertain: false },
    { name: "Gracenessa", selected: false, uncertain: false },
    { name: "Architecra (Esra)", selected: false, uncertain: false },
    { name: "Gowner (Enes)", selected: false, uncertain: false },
    { name: "Koray752", selected: false, uncertain: false },
    { name: "Erva", selected: false, uncertain: false },
    { name: "Ceycey (Ceylin)", selected: false, uncertain: false },
    { name: "Westiger (Cansu)", selected: false, uncertain: false },
    { name: "Attalian (Cem)", selected: false, uncertain: false },
    { name: "Xeegn (Berkay)", selected: false, uncertain: false },
    { name: "Kraytage (Eray)", selected: false, uncertain: false },
    { name: "Wicanydd (İlkcan)", selected: false, uncertain: false },
    { name: "RedB (Mert)", selected: false, uncertain: false },
    { name: "Tsuna (Veysel)", selected: false, uncertain: false },
    { name: "Wixiety (Doğukan)", selected: false, uncertain: false },
    { name: "Mr.Takini", selected: false, uncertain: false },
  ]);

  const [selectedGame, setSelectedGame] = useState(null);
  const [results, setResults] = useState([]);
  const [isEditing, setIsEditing] = useState(null); // Track the result being edited

  useEffect(() => {
    const selectedUsersRef = ref(db, "/selectedusers");
    const selectedGamesRef = ref(db, "/selectedgames");

    onValue(selectedUsersRef, (snapshot) => {
      const usersData = snapshot.val();
      if (usersData) {
        const usersList = Object.values(usersData).map((item) => ({
          selectedNames: item.selected || [],
          uncertainNames: item.uncertain || [],
        }));

        onValue(selectedGamesRef, (gameSnapshot) => {
          const gamesData = gameSnapshot.val();
          if (gamesData) {
            const gamesList = Object.values(gamesData).map((item, index) => ({
              game: item.game,
              selectedNames: usersList[index]?.selectedNames || [],
              uncertainNames: usersList[index]?.uncertainNames || [],
              editing: false,
            }));

            setResults(gamesList);
          }
        });
      }
    });
  }, []);


  const customStyles = {
    option: (provided) => ({
      ...provided,
      color: "black",
    }),
    control: (provided) => ({
      ...provided,
      color: "black",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black",
    }),
  };

  const handleCheckboxChange = (index, type) => {
    const newNames = [...names];
    if (type === "selected") {
      newNames[index].selected = !newNames[index].selected;
    } else if (type === "uncertain") {
      newNames[index].uncertain = !newNames[index].uncertain;
    }
    setNames(newNames);
  };

  const handleSubmit = async () => {
    const selected = names.filter((item) => item.selected).map((item) => item.name);
    const uncertain = names.filter((item) => item.uncertain).map((item) => item.name);

    if (selectedGame) {
      await set(push(ref(db, "/selectedusers")), {
        selected,
        uncertain,
        timestamp: Date.now()
      });

      await set(push(ref(db, "/selectedgames")), {
        game: selectedGame.label,
        timestamp: Date.now()
      });

      setResults([...results, {
        game: selectedGame.label,
        selectedNames: selected,
        uncertainNames: uncertain,
        editing: false
      }]);
    }
  };

  // Removes data from both references and clears the local results
  const handleClear = async () => {
    await remove(ref(db, "/selectedgames"));
    await remove(ref(db, "/selectedusers"));
    setResults([]);
  };

  const handleEditToggle = (index) => {
    const newResults = [...results];
    newResults[index].editing = !newResults[index].editing;
    setResults(newResults);
    setIsEditing(index);
  };

  const handleNameToggle = (resultIndex, name, type) => {
    const newResults = [...results];
    const currentResult = newResults[resultIndex];

    if (type === "selected") {
      if (currentResult.selectedNames.includes(name)) {
        currentResult.selectedNames = currentResult.selectedNames.filter(
          (n) => n !== name
        );
      } else {
        currentResult.selectedNames.push(name);
      }
    } else if (type === "uncertain") {
      if (currentResult.uncertainNames.includes(name)) {
        currentResult.uncertainNames = currentResult.uncertainNames.filter(
          (n) => n !== name
        );
      } else {
        currentResult.uncertainNames.push(name);
      }
    }

    setResults(newResults);
  };

  const handleGameChange = (selectedOption) => {
    setSelectedGame(selectedOption);
  };

  const half = Math.ceil(names.length / 2);
  const firstHalf = names.slice(0, half);
  const secondHalf = names.slice(half);

  return (
    <div className="ekiplist-container">
      <div className="list-container">
        <h1>Ekip Listesi</h1>
        <div className="game-select-container">
          <CreatableSelect
              instanceId="my-select"
              name="my-select"
            options={gameOptions}
            value={selectedGame}
            onChange={handleGameChange}
            placeholder="Bir oyun seçiniz veya yazınız..."
            styles={customStyles}
          />
        </div>
        <div className="split-list">
          <ul>
            {firstHalf.map((item, index) => (
              <li key={index} className={item.selected ? "selected" : ""}>
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => handleCheckboxChange(index, "selected")}
                  className="hidden-checkbox"
                />
                <label>{item.name}</label>
                <input
                  type="checkbox"
                  checked={item.uncertain}
                  onChange={() => handleCheckboxChange(index, "uncertain")}
                />
                <label>?</label>
              </li>
            ))}
          </ul>
          <ul>
            {secondHalf.map((item, index) => (
              <li
                key={index + half}
                className={item.selected ? "selected" : ""}
              >
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() =>
                    handleCheckboxChange(index + half, "selected")
                  }
                  className="hidden-checkbox"
                />
                <label>{item.name}</label>
                <input
                  type="checkbox"
                  checked={item.uncertain}
                  onChange={() =>
                    handleCheckboxChange(index + half, "uncertain")
                  }
                />
                <label>?</label>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleSubmit}>Oyun Ekle</button>
      </div>
      <div className="selected-names-container">
        <h1>Menü</h1>
        {results.map((result, index) => (
          <div key={index} className="game-container">
            <strong>{result.game}</strong>:{" "}
            {result.selectedNames.map((name) => name + " - ")}
            {result.uncertainNames.map((name) => name + " (?) - ")}
            <span>
              {" | " +
                result.selectedNames.length +
                " + " +
                result.uncertainNames.length +
                " ?"}
            </span>
            <button onClick={() => handleEditToggle(index)}>
              {result.editing ? "Düzenlemeyi Bitir" : "Düzenle"}
            </button>
            {result.editing && (
              <div className="edit-section">
                <h3>Oyuncuları Düzenle</h3>
                {names.map((item, idx) => (
                  <div key={idx} className="edit-item">
                    <input
                      type="checkbox"
                      checked={result.selectedNames.includes(item.name)}
                      onChange={() =>
                        handleNameToggle(index, item.name, "selected")
                      }
                    />
                    <label>{item.name}</label>
                    <input
                      type="checkbox"
                      checked={result.uncertainNames.includes(item.name)}
                      onChange={() =>
                        handleNameToggle(index, item.name, "uncertain")
                      }
                    />
                    <label>?</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <button
            onClick={handleClear}
        >
          Listeyi Temizle
        </button>
      </div>
    </div>
  );
}

export default EkipList;
