import React from "react";
import "../styles/navbar.css";
import logoImage from "../assets/music-map-logomvp.png";

export default function NavBar() {
  return (
    <div className="logo-container">
      <img src={logoImage} alt="MusicMap Logo" />
    </div>
  );
}
