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
import musicNote from "../assets/musicnote.png";
import SongPostSideBar from "./SongPostSideBar";

const maptilerApiKey = "UHRJl9L3oK7bh3QT6De6";
const maptilerMapReference = "81f4a9a5-c669-4154-8905-38ffd71706b6";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const initialState = {
    lng: -117.71350614401385,
    lat: 34.09932899451676,
    zoom: 16.5,
  };
  const [showAddSongSidebar, setShowAddSongSidebar] = useState(false);
  const [showSongPostSidebar, setShowSongPostSidebar] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [coordinates, setCoordinates] = useState({ lng: null, lat: null });
  const [playingSongId, setPlayingSongId] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const tempLayerId = "tempMusicNoteLayer";
  const tempSourceId = "tempMusicNote";

  const [selectedPosts, setSelectedPosts] = useState([]); // Declare setPost here

  const handlePlaySong = (songId) => {
    if (playingSongId === songId) {
      setPlayingSongId(null); // If the same song is clicked, stop it
    } else {
      setPlayingSongId(songId); // Change to the new song
    }
  };

  const addNewPost = (newPost) => {
    setSelectedPosts((prevPosts) => {
      // Update the state with the new post
      const updatedPosts = [...prevPosts, newPost];

      // Check if the map and the musicNotes source are loaded
      if (map.current && map.current.getSource("musicNotes")) {
        // Retrieve the current data from the source
        const currentData = map.current.getSource("musicNotes")._data;

        // Create a new feature for the new post
        const newFeature = {
          type: "Feature",
          properties: {
            id: newPost._id,
            song_id: newPost.song_id,
            username: newPost.username,
            description: newPost.description,
            likes: newPost.likes,
            comments: newPost.comments,
          },
          geometry: {
            type: "Point",
            coordinates: newPost.location.coordinates,
          },
        };

        // Update the source data
        currentData.features.push(newFeature);
        map.current.getSource("musicNotes").setData(currentData);
      }

      // Return the updated posts array to update the state
      return updatedPosts;
    });
  };

  const handleAddComment = async (songID, commentText, commentUsername) => {
    try {
      const response = await fetch(
        `http://localhost:8800/api/songposts/${songID}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: commentText,
            username: commentUsername || "Anonymous",
          }),
        }
      );
      const updatedSongPost = await response.json(); // Now it receives the entire updated song post

      console.log("Updated song post:", updatedSongPost);

      // Update the local state with the entire updated song post
      setSelectedPosts((prevPosts) => {
        return prevPosts.map((post) => {
          if (post.song_id === songID) {
            // Parse the comments string into a JSON object if it's a string
            const parsedComments =
              typeof updatedSongPost.comments === "string"
                ? JSON.parse(updatedSongPost.comments)
                : updatedSongPost.comments;
            // Merge the parsed comments from the updated post into the existing post
            return { ...post, comments: parsedComments };
          }
          return post;
        });
      });
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleLike = async (songID) => {
    if (!isLiked) {
      try {
        // Make an API call to your backend to increment the like count
        const response = await fetch(
          `http://localhost:8800/api/songposts/${songID}/like`,
          {
            method: "POST",
          }
        );
        const updatedPost = await response.json();

        // Update the local state to reflect the new like count
        setSelectedPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.song_id === songID) {
              return { ...post, likes: updatedPost.likes };
            }
            return post;
          })
        );
        setIsLiked(true);
      } catch (error) {
        console.error("Failed to like post:", error);
      }
    } else {
      try {
        // Make an API call to your backend to increment the like count
        const response = await fetch(
          `http://localhost:8800/api/songposts/${songID}/unlike`,
          {
            method: "POST",
          }
        );
        const updatedPost = await response.json();

        // Update the local state to reflect the new like count
        setSelectedPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.song_id === songID) {
              return { ...post, likes: updatedPost.likes };
            }
            return post;
          })
        );
        setIsLiked(false);
      } catch (error) {
        console.error("Failed to unlike post:", error);
      }
    }
  };

  // removes temporary selected marker
  const removeTempLayer = () => {
    if (map.current.getLayer(tempLayerId)) {
      map.current.removeLayer(tempLayerId);
    }
    if (map.current.getSource(tempSourceId)) {
      map.current.removeSource(tempSourceId);
    }
  };

  // closes posts overlay and deselects all notes
  const closePostOverlay = () => {
    setShowSongPostSidebar(false);
    map.current.setLayoutProperty("musicNotePins", "icon-image", "musicNote");
    setSelectedNoteId(null);
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    axios
      .get("http://localhost:8800/api/songposts")
      .then((response) => {
        // Handle successful response
        const postData = response.data.map((post) => ({
          type: "Feature",
          properties: {
            id: post._id,
            song_id: post.song_id,
            username: post.username,
            description: post.description,
            likes: post.likes,
            comments: post.comments,
          },
          geometry: {
            type: "Point",
            coordinates: post.location.coordinates,
          },
        }));

        // setPost(postData); // Set the fetched data to post state

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
              data: {
                type: "FeatureCollection",
                features: postData,
              },
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
              const id = features[0].properties.id;
              setSelectedNoteId(id);
              setShowSongPostSidebar(true);
              setShowAddSongSidebar(false);

              const coordinates = features[0].geometry.coordinates;
              setCoordinates({ lng: coordinates[0], lat: coordinates[1] });

              const posts = features.map((feature) => ({
                username: feature.properties.username,
                song_id: feature.properties.song_id,
                description: feature.properties.description,
                likes: feature.properties.likes,
                comments: feature.properties.comments,
              }));

              // Pass the posts to the SongPostSideBar component
              setSelectedPosts(posts);
            } else {
              // if user clicks on an empty space
              const { lng, lat } = e.lngLat;
              removeTempLayer();
              closePostOverlay();

              // creates temporary marker
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
              setCoordinates({ lng, lat });

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
      })
      .catch((error) => {
        // Handle fetch error
        console.error("Error fetching song posts:", error);
      });
  }, []);

  // changes music note to be selected when selectedNoteId changes
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    map.current.setLayoutProperty("musicNotePins", "icon-image", [
      "case",
      ["==", ["get", "id"], selectedNoteId],
      "selectedMusicNote",
      "musicNote",
    ]);
  }, [selectedNoteId]);

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
            removeTempLayer();
            setShowAddSongSidebar(false);
            closePostOverlay();
            setCoordinates({ lng: null, lat: null });
          }}
          lng={coordinates.lng}
          lat={coordinates.lat}
          addNewPost={addNewPost} // Passing the function to update posts
        />
      )}
      {showSongPostSidebar && (
        <SongPostSideBar
          closeSongPostSidebar={() => closePostOverlay()}
          openAddSongSidebar={() => {
            setShowAddSongSidebar(true);
            setShowSongPostSidebar(false);
          }}
          posts={selectedPosts}
          handleAddComment={handleAddComment}
          handleLike={handleLike}
          onPlaySong={handlePlaySong}
          playingSongId={playingSongId}
        />
      )}
    </>
  );
};

export default Map;
