import "../styles/sidebar.css";
import { useState, useEffect } from "react";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
  Col,
} from "react-bootstrap";
import axios from "axios";
import Closebutton from "../assets/closeicon.png";
import "../styles/addSong.css";
import searchIcon from "../assets/search-icon.png";

const AddSongSideBar = ({ closeAddSongSidebar, lng, lat, addNewPost }) => {
  const [selectedSong, setSelectedSong] = useState(null);
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");
  const [tracks, setTracks] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [selectedSongId, setSelectedSongId] = useState(null);

  const SPOTIFY_CLIENT_ID = "cd433caa648d451aa7bbdccaea7658a6";
  const SPOTIFY_CLIENT_SECRET = "5069acac77184a78a302939392c4d9ec";

  useEffect(() => {
    fetchAccessToken();
  }, []);

  useEffect(() => {
    if (searchInput.length === 0) {
      setTracks([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      search();
    }, 150); // Delays the search call by 175 milliseconds

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  const fetchAccessToken = async () => {
    try {
      const authParameters = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`,
      };

      const response = await fetch(
        "https://accounts.spotify.com/api/token",
        authParameters
      );
      const data = await response.json();
      setAccessToken(data.access_token);
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  };

  const selectSong = (songId) => {
    setSelectedSongId(songId);
    const selectedSongData = tracks.find((song) => song.id === songId);
    setSelectedSong(selectedSongData);
  };

  async function search() {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${searchInput}&type=track&market=US&limit=5`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      const extractedTracks = data.tracks.items.map((item) => ({
        id: item.id,
        name: item.name,
        artist: item.artists[0].name,
        album: item.album.name,
        preview_url: item.preview_url,
        image_url: item.album.images[0].url,
      }));
      setTracks(extractedTracks);
    } catch (error) {
      console.error("Error searching for tracks:", error);
    }
  }

  const addMoment = async () => {
    if (!selectedSongId) {
      console.log("Song required");
      return;
    }

    const newSongNote = {
      type: "Feature",
      properties: {
        username: username,
        song_id: selectedSongId,
        description: description,
        likes: 0, // Initial likes set to 0
        comments: [], // Initial comments set to an empty array
        reportedAt: new Date().toISOString(), // Current timestamp
      },
      geometry: {
        type: "Point",
        coordinates: [lng, lat], // Longitude and Latitude
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:8800/api/songposts",
        newSongNote
      );
      console.log("Successfully added the song post:", response.data);
      addNewPost(response.data);

      // Close sidebar and reset form after successful submission
      closeAddSongSidebar();
      setSelectedSong(null);
      setSelectedSongId(null);
      setDescription("");
      setUsername("");
    } catch (error) {
      console.error("Failed to add song post:", error);
    }
  };

  return (
    <aside className="overlay overlay--add">
      <div className="action-button-container">
        <button
          onClick={closeAddSongSidebar}
          position="right"
          className="close-btn2"
        >
          <img src={Closebutton} alt="close button" />
        </button>
      </div>
      <div className="overlay__outer">
        <div className="overlay__content">
          <section>
            <div className="overlay__section-text">
              What song connects you to this location?
            </div>
            <div className="App">
              <Container>
                <img
                  src={searchIcon}
                  alt="search icon"
                  className="search-icon"
                />
                <InputGroup className="search-bar" size="lg">
                  <FormControl
                    className="searchbar"
                    type="input"
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        search();
                      }
                    }}
                    onChange={(event) => setSearchInput(event.target.value)}
                  />
                  <Button onClick={search} className="search-button">
                    Search
                  </Button>
                </InputGroup>
              </Container>
              <Row className="mx-2">
                {selectedSong ? (
                  <Col xs={12} className="mb-3 mt-3">
                    <Card
                      className="song-card"
                      onClick={() => selectSong(null)}
                    >
                      <div className="song-card__inner">
                        <div className="song-card__image">
                          <Card.Img
                            src={selectedSong.image_url}
                            className="img-fluid"
                          />
                        </div>
                        <div className="song-card__details">
                          <Card.Body>
                            <Card.Title>{selectedSong.name}</Card.Title>
                            <Card.Text>Artist: {selectedSong.artist}</Card.Text>
                          </Card.Body>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ) : (
                  tracks.map((song, i) => (
                    <Col xs={12} md={6} lg={4} key={i} className="mb-3">
                      <Card
                        className="song-card"
                        onClick={() => selectSong(song.id)}
                      >
                        <div className="song-card__inner">
                          <div className="song-card__image">
                            <Card.Img
                              src={song.image_url}
                              className="img-fluid"
                            />
                          </div>
                          <div className="song-card__details">
                            <Card.Body>
                              <Card.Title>{song.name}</Card.Title>
                              <Card.Text>Artist: {song.artist}</Card.Text>
                            </Card.Body>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))
                )}
              </Row>
            </div>
            <div className="note-text">
              Write a note (optional)
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="subform"
              ></textarea>
              <InputGroup className="username">
                <FormControl
                  placeholder="Username (optional)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </InputGroup>
              <button className="add-button" onClick={addMoment}>
                Add
              </button>
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
};

export default AddSongSideBar;
