import React, { useState } from "react";
import "./EkipList.css";

function EkipList() {
  const [names, setNames] = useState([
    { name: "H1vezZz", selected: true },
    { name: "Unicorn (Burcu)", selected: false },
    { name: "Sado_Mi (Sadullah Abi)", selected: false },
    { name: "FiltreKaffe (Esra)", selected: false },
    { name: "Watson", selected: false },
    { name: "Solitude (Arif)", selected: false },
    { name: "Nieve (Berfin)", selected: false },
    { name: "Ecedeggy (Arda)", selected: false },
    { name: "anilcakirr", selected: false },
    { name: "Gracenessa", selected: false },
    { name: "Architecra (Esra)", selected: false },
    { name: "Gowner (Enes)", selected: false },
    { name: "Koray752", selected: false },
    { name: "Erva", selected: false },
    { name: "Ceycey", selected: false },
    { name: "Westiger (Cansu)", selected: false },
    { name: "Attalian (Cem)", selected: false },
  ]);
  const [selectedNames, setSelectedNames] = useState([]);

  const handleCheckboxChange = (index) => {
    const newNames = [...names];
    newNames[index].selected = !newNames[index].selected;
    setNames(newNames);
  };

  const handleSubmit = () => {
    const selected = names
      .filter((item) => item.selected)
      .map((item) => item.name);
    setSelectedNames(selected);
  };

  return (
    <div className="ekiplist-container">
      <div className="list-container">
        <h1>Ekip Listesi</h1>
        <ul>
          {names.map((item, index) => (
            <li key={index}>
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => handleCheckboxChange(index)}
              />
              <label>{item.name}</label>
            </li>
          ))}
        </ul>
        <button onClick={handleSubmit}>Listeyi Oluştur</button>
      </div>
      <div className="selected-names-container">
        <h1>Seçilen İsimler</h1>
        <div>
          {selectedNames.length > 0
            ? selectedNames.join(" - ")
            : "Hiçbir isim seçilmedi."}
        </div>
      </div>
    </div>
  );
}

export default EkipList;