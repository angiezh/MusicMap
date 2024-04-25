import { useState } from "react";
import React from "react";
import "../styles/infoOverlay.css";
import MusicNote from "../assets/musicnote.png";
import Addsongnote from "../assets/Add Song Button.png";

const InfoOverlay = () => {
  const [showInfoOverlay, setShowInfoOverlay] = useState(true);

  const handleClick = () => {
    setShowInfoOverlay(false);
  };
  return (
    <div>
      {showInfoOverlay && (
        <aside className="infooverlay infooverlay--add">
          <div className="infooverlay__outer">
            <div className="infooverlay-content">
              <section>
                <div
                  className="infooverlay__section-text"
                  style={{
                    textAlign: "center",
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#A03232",
                  }}
                >
                  Welcome to MusicMap!
                </div>
                <p
                  style={{
                    textAlign: "left",
                    fontSize: "25px",
                    fontWeight: "bold",
                    color: "#A03232",
                  }}
                >
                  Our Mission
                </p>
                <p style={{ textAlign: "center" }}>
                  Provide a social space for people to share music related to
                  locations that hold special meaning to them.
                </p>
                <p
                  style={{
                    textAlign: "left",
                    fontSize: "25px",
                    fontWeight: "bold",
                    color: "#A03232",
                  }}
                >
                  How to use it
                </p>
                <p style={{ textAlign: "left", lineHeight: 1 }}>
                  Click on the map to drop a{" "}
                  <img src={MusicNote} alt="music note" />
                </p>
                <p style={{ textAlign: "left", lineHeight: 1 }}>
                  OR, click on an existing music note
                  <img src={MusicNote} alt="music note" />{" "}
                </p>
                <p style={{ textAlign: "left", lineHeight: 1 }}>
                  From there, scroll the side bar to see the feed of music
                  people may have posted in that area.
                </p>
                <p style={{ textAlign: "left", lineHeight: 1 }}>
                  You can also click
                  <img src={Addsongnote} alt="music note" />
                  to create your own post
                </p>
                <div
                  className="action-button-container"
                  style={{ textAlign: "right" }}
                >
                  <button
                    onClick={handleClick}
                    style={{
                      backgroundColor: "#A03232",
                      border: "none",
                      color: "#FFFFFF",
                      padding: "10px 20px",
                      textAlign: "center",
                      textDecoration: "none",
                      display: "inline-block",
                      fontSize: "25px",
                      margin: "4px 2px",
                      transitionDuration: "0.4s",
                      cursor: "pointer",
                      borderRadius: "8px",
                    }}
                  >
                    Begin
                  </button>
                </div>
              </section>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
export default InfoOverlay;
