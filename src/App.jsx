import { useEffect, useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";

export default function App() {
 return (
  <div>
    <div className="bg-layer"></div>
    <div className="blur-layer"></div>

    <div className="content flex items-center justify-center min-h-screen">
      <h1 className="title">
        🍓 FLASHCARD VÀ TỪ ĐIỂN CHO BÉ DÂU NÈ 🍓
      </h1>
      <div className="menu-btns">
          <Link to="/dictionary" className="btn">
            TỪ ĐIỂN
          </Link>

          <Link to="/flashcard" className="btn">
            FLASHCARD
          </Link>
        </div>
    </div>
  </div>
);
}