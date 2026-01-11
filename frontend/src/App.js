import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapView from "./components/MapView";
import AddFarmForm from "./components/AddFarmForm";
import FarmDetails from "./components/FarmDetails";
import "./styles/style.css";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <Router>
      <div className="App">
        <div className="app-header">
          <h1>GIS - Wind Farms in the Balkans</h1>
        </div>

        <Routes>
          {/* Main page with MapView only */}
          <Route 
            path="/" 
            element={
              <div>
                <AddFarmForm onAdd={() => setRefresh(!refresh)} />
                <MapView key={refresh} />
              </div>
            } 
          />

          {/* Farm details page */}
          <Route path="/farm/:id" element={<FarmDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
