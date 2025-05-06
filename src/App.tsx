import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./pages/MainPage";
import CityDetailsPage from "./pages/CityDetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/city/:cityId" element={<CityDetailsPage />} />
    </Routes>
  );
}

export default App;
