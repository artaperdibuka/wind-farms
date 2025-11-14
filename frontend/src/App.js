import React, { useState } from "react";
import MapView from "./components/MapView";
import AddFarmForm from "./components/AddFarmForm";
import { TbWindmill } from "react-icons/tb";
import "./styles/style.css";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="App">
      <div className="app-header">
        {/* Zgjidh një nga këto klasa: */}
        <TbWindmill className="windmill-icon spinning-circular" />
        {/* Ose: spinning-circular-fast */}
        {/* Ose: spinning-windmill-pulse */}
        {/* Ose: spinning-energy */}
        <h1>GIS - Fermat e Erës në Ballkan</h1>
      </div>
      <AddFarmForm onAdd={() => setRefresh(!refresh)} />
      <MapView key={refresh} />
    </div>
  );
}

export default App;