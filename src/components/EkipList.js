import React, { useState } from "react";
import Select from "react-select";
import "./EkipList.css";

const gameOptions = [
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
    { name: "Ceycey", selected: false, uncertain: false },
    { name: "Westiger (Cansu)", selected: false, uncertain: false },
    { name: "Attalian (Cem)", selected: false, uncertain: false },
  ]);

  const [selectedNames, setSelectedNames] = useState([]);
  const [uncertainNames, setUncertainNames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  const handleCheckboxChange = (index, type) => {
    const newNames = [...names];
    if (type === "selected") {
      newNames[index].selected = !newNames[index].selected;
    } else if (type === "uncertain") {
      newNames[index].uncertain = !newNames[index].uncertain;
    }
    setNames(newNames);
  };

  const handleSubmit = () => {
    const selected = names
      .filter((item) => item.selected)
      .map((item) => item.name);
    const uncertain = names
      .filter((item) => item.uncertain)
      .map((item) => item.name);
    setSelectedNames(selected);
    setUncertainNames(uncertain);
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
        <div className="split-list">
          <ul>
            {firstHalf.map((item, index) => (
              <li
                key={index}
                className={item.selected ? "selected" : ""}
                onClick={() => handleCheckboxChange(index, "selected")}
              >
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
                onClick={() => handleCheckboxChange(index + half, "selected")}
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
        <div className="game-select-container">
          <Select
            options={gameOptions}
            value={selectedGame}
            onChange={handleGameChange}
            placeholder="Select a game..."
          />
        </div>
        <button onClick={handleSubmit}>Listeyi Oluştur</button>
      </div>
      <div className="selected-names-container">
        <h1>Menü</h1>
        <div>
          {selectedGame.label + ": "}
          {selectedNames.map((name) => name + " - ")}
          {uncertainNames.map((name) => name + " (?) - ")}
          {" | " + selectedNames.length + " + " + uncertainNames.length + "  ?"}
        </div>
      </div>
    </div>
  );
}

export default EkipList;
