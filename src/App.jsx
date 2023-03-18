import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import InputDataClub from "./components/InputDataClub";
import InputMultipleDataScore from "./components/InputMultipleDataScore";
import InputSingleDataScore from "./components/InputSingleDataScore";
import Navbar from "./components/Navbar";
import ViewClassement from "./components/ViewClassement";

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
      </div>
      <div className="flex justify-around m-5">
        <Routes>
          <Route path="/" element={<ViewClassement />} />
          <Route path="/input-data-klub" element={<InputDataClub />} />
          <Route path="/input-skor" element={<InputSingleDataScore />} />
          <Route path="/input-multi-skor" element={<InputMultipleDataScore />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
