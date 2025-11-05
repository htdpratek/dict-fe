import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Flashcard from "./pages/Flashcard";
import Dictionary from "./pages/Dictionary";

import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/flashcard" element={<Flashcard />} />
      <Route path="/dictionary" element={<Dictionary />} />
    </Routes>
  </BrowserRouter>
);
