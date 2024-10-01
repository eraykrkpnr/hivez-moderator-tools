import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Countdown from "./components/Countdown";
import EkipList from "./components/EkipList";
import TeamGenerator from "./components/TeamSelector";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Countdown />} />
          <Route path="/EkipList" element={<EkipList />} />
          <Route path="/TeamSelector" element={<TeamGenerator />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
