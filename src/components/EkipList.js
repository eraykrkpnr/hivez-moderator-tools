import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
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
    { name: "Wicanydd (İlkcan)", selected: false, uncertain: false },
    { name: "RedB (Mert)", selected: false, uncertain: false },
    { name: "Tsuna (Veysel)", selected: false, uncertain: false },
    { name: "Wixiety (Doğukan)", selected: false, uncertain: false },
    { name: "Mr.Takini", selected: false, uncertain: false },
  ]);

  const [selectedGame, setSelectedGame] = useState(null);
  const [results, setResults] = useState([]);

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

  const handleSubmit = () => {
    // Seçilen isimler
    const selected = names
      .filter((item) => item.selected)
      .map((item) => item.name);

    // Belirsiz isimler
    const uncertain = names
      .filter((item) => item.uncertain)
      .map((item) => item.name);

    // Hem seçili hem de belirsiz olmayan isimler
    const notSelectedOrUncertain = names
      .filter((item) => !item.selected && !item.uncertain) // Seçilmemiş ve belirsiz olmayan isimler
      .map((item) => item.name);

    if (selectedGame) {
      const newResult = {
        game: selectedGame.label,
        selectedNames: selected,
        uncertainNames: uncertain,
        notSelectedOrUncertainNames: notSelectedOrUncertain, // Seçilmeyenler de eklendi
      };
      setResults([...results, newResult]);
    }
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
        <button onClick={handleSubmit}>Oyun Ekle</button>
      </div>
      <div className="selected-names-container">
        <h1>Menü</h1>
        {results.map((result, index) => (
          <div key={index} className="game-container">
            <strong>{result.game}</strong>:{" "}
            {result.selectedNames.map((name) => name + " - ")}
            {result.uncertainNames.map((name) => name + " (?) - ")}
            {" | " +
              result.selectedNames.length +
              " + " +
              result.uncertainNames.length +
              " ?"}
            {/*<p>
              {"Gelemeyenler: " +
                result.notSelectedOrUncertainNames.map((name) => name + " - ")}
        </p>*/}
          </div>
        ))}
        <button
          onClick={() => {
            setResults([]);
          }}
        >
          Listeyi Temizle
        </button>
      </div>
    </div>
  );
}

export default EkipList;
