import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { GeocodingControl } from "@maptiler/geocoding-control/maplibregl";
import "@maptiler/geocoding-control/style.css";
import "../styles/searchBar.css";
import "../styles/sidebar.css";
import "../styles/map.css";
import axios from "axios";
import AddSongSideBar from "./AddSongSideBar";
import selectedMusicNote from "../assets/selected-music-note.png";

import postData from "../data/posts.geojson";
import musicNote from "../assets/musicnote.png";
import SongPostSideBar from "./SongPostSideBar";

const maptilerApiKey = "UHRJl9L3oK7bh3QT6De6";
const maptilerMapReference = "99cf5fa2-3c1e-4adf-a1c1-fd879b417597";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const initialState = {
    lng: -117.71319812050054,
    lat: 34.099885457669316,
    zoom: 16.5,
  };
  const [showAddSongSidebar, setShowAddSongSidebar] = useState(false);
  const [showSongPostSidebar, setShowSongPostSidebar] = useState(false);
  const [post, setPost] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const tempLayerId = "tempMusicNoteLayer";
  const tempSourceId = "tempMusicNote";

  const addPosts = (newPosts) => {
    setPost((prevPosts) => [...prevPosts, ...newPosts]);
  };

  const removeTempLayer = () => {
    if (map.current.getLayer(tempLayerId)) {
      map.current.removeLayer(tempLayerId);
    }
    if (map.current.getSource(tempSourceId)) {
      map.current.removeSource(tempSourceId);
    }
  };

  const closePostOverlay = () => {
    setShowSongPostSidebar(false);
    if (selectedNoteId) {
      map.current.setLayoutProperty("musicNotePins", "icon-image", "musicNote");
      setSelectedNoteId(null);
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/${maptilerMapReference}/style.json?key=${maptilerApiKey}`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
      minZoom: 2,
      maxZoom: 18,
    });

    // When the map loads
    mapInstance.on("load", () => {
      console.log("Map loaded successfully");

      mapInstance.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        "bottom-right"
      );

      const gc = new GeocodingControl({
        apiKey: maptilerApiKey,
        map: mapInstance,
      });

      mapInstance.addControl(gc);
      mapInstance.keyboard.enable();

      // load music note icons
      const selectedNote = new Image();
      selectedNote.src = selectedMusicNote;
      selectedNote.onload = () => {
        mapInstance.addImage("selectedMusicNote", selectedNote);
      };

      const regularNote = new Image();
      regularNote.src = musicNote;
      regularNote.onload = () => {
        mapInstance.addImage("musicNote", regularNote);

        mapInstance.addSource("musicNotes", {
          type: "geojson",
          data: postData,
        });

        mapInstance.addLayer({
          id: "musicNotePins",
          type: "symbol",
          source: "musicNotes",
          layout: {
            "icon-image": [
              "case",
              ["==", ["get", "id"], selectedNoteId],
              "selectedMusicNote",
              "musicNote",
            ],
            "icon-allow-overlap": true,
          },
        });
      };

      // if user clicks on the map
      mapInstance.on("click", (e) => {
        const features = mapInstance.queryRenderedFeatures(e.point, {
          layers: ["musicNotePins"],
        });

        // if user clicks on the music note
        if (features.length > 0) {
          removeTempLayer();
          setPost([]);
          const id = features[0].properties.id;
          setSelectedNoteId(id);
          setShowSongPostSidebar(true);
          setShowAddSongSidebar(false);

          const properties = features[0].properties;
          const posts = JSON.parse(properties.posts);

          addPosts(posts);
        } else {
          // if user clicks on an empty space
          const { lng, lat } = e.lngLat;
          closePostOverlay();
          removeTempLayer();

          mapInstance.addSource(tempSourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [lng, lat],
              },
            },
          });

          mapInstance.addLayer({
            id: tempLayerId,
            type: "symbol",
            source: tempSourceId,
            layout: {
              "icon-image": "selectedMusicNote",
              "icon-allow-overlap": true,
              "icon-size": 1,
            },
          });

          // Pulls up add song sidebar
          setShowAddSongSidebar(true);
        }
      });
    });

    mapInstance.on("error", (error) => {
      console.error("An error occurred while loading the map:", error);
    });

    map.current = mapInstance;

    // Function to open the sidebar
    window.openSidebar = () => {
      setShowAddSongSidebar(true);
    };

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    // Ensures that every time the selectedNoteId changes, the icon updates accordingly
    map.current.setLayoutProperty("musicNotePins", "icon-image", [
      "case",
      ["==", ["get", "id"], selectedNoteId],
      "selectedMusicNote", // This applies only if there is a selected note
      "musicNote", // Default icon
    ]);

    // Logs to check what is being set
    console.log("current id", selectedNoteId);
  }, [selectedNoteId]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // Create JSON object with the selected drug type, notes, zip code, and reportedAt timestamp
  //   const reportData = {
  //     notes: notes,
  //     zipCode: sidebarPostalCode,
  //     reportedAt: new Date().toISOString(),
  //   };

  //   // Submit the report data to your backend API
  //   axios
  //     .post("http://localhost:8800/api/reports", reportData)
  //     .then((response) => {
  //       console.log("Report submitted successfully:", response.data);
  //       // Optionally, you can reset the form fields or close the sidebar after successful submission
  //       setNotes("");
  //       setShowAddSongSidebar(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error submitting report:", error);
  //       // Handle error, display error message, etc.
  //     });
  // };

  return (
    <>
      <div
        id="map"
        ref={mapContainer}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />
      {showAddSongSidebar && (
        <AddSongSideBar
          closeAddSongSidebar={() => {
            setShowAddSongSidebar(false);
            removeTempLayer();
          }}
        />
      )}
      {showSongPostSidebar && (
        <SongPostSideBar
          closeSongPostSidebar={() => closePostOverlay()}
          openAddSongSidebar={() => {
            setShowAddSongSidebar(true);
            setShowSongPostSidebar(false);
          }}
          posts={post}
        />
      )}
    </>
  );
};

export default Map;
