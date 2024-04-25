import React from "react";
import "../styles/navbar.css";
import logoImage from "../assets/music-map-logomvp.png";

export default function NavBar() {
  return (
    <div className="logo-container" style={{height:"20px", weight:"20px"}}>
      <img src={logoImage} alt="MusicMap Logo" />
    </div>
  );
}
