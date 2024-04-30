import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import "../styles/sidebar.css";
import "../styles/songPostSidebar.css";
import playButton from "../assets/play-button.png";
import pauseButton from "../assets/pause-button.png";
import exportButton from "../assets/export-icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const SongPost = ({
  songID,
  description,
  username,
  comments,
  likes,
  onPlaySong,
  playingSongId,
  handleAddComment,
  handleLike,
}) => {
  const isPlaying = songID === playingSongId;
  const [accessToken, setAccessToken] = useState("");
  const [songData, setSongData] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentUsername, setCommentUsername] = useState("");
  const [localComments, setLocalComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  const SPOTIFY_CLIENT_ID = "cd433caa648d451aa7bbdccaea7658a6";
  const SPOTIFY_CLIENT_SECRET = "5069acac77184a78a302939392c4d9ec";

  useEffect(() => {
    // Check if comments is a string and parse it
    if (typeof comments === "string") {
      try {
        const parsedComments = JSON.parse(comments);
        if (Array.isArray(parsedComments)) {
          setLocalComments(parsedComments);
        } else {
          console.error("Parsed comments are not an array:", parsedComments);
          setLocalComments([]);
        }
      } catch (error) {
        console.error("Error parsing comments:", error);
        setLocalComments([]); // Set to empty array if parsing fails
      }
    } else if (Array.isArray(comments)) {
      setLocalComments(comments);
    } else {
      console.error(
        "Comments prop is neither an array nor a string:",
        comments
      );
      setLocalComments([]);
    }
  }, [comments]);

  useEffect(() => {
    fetchAccessToken();
  }, []);

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

  const fetchSongData = async () => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${songID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setSongData(data);
    } catch (error) {
      console.error("Error fetching song data:", error);
    }
  };

  const submitComment = () => {
    const trimmedUsername = commentUsername.trim();
    const usernameToUse =
      trimmedUsername.length > 0 ? trimmedUsername : "Anonymous";
    if (!commentText.trim()) return;

    handleAddComment(songID, commentText, usernameToUse); // Calls the function passed via props to handle comment addition
    setLocalComments([
      ...localComments,
      { username: usernameToUse, text: commentText },
    ]); // Adds new comment to local state
    setCommentText(""); // Clears the comment text field
    setCommentUsername(""); // Clears the username field
  };

  const handleLikeToggle = () => {
    if (isLiked) {
      setIsLiked(false);
    } else {
      setIsLiked(true);
    }
    handleLike(songID);
  };

  useEffect(() => {
    if (accessToken && songID) {
      fetchSongData();
    }
  }, [accessToken, songID]);

  const handlePlayPause = () => {
    onPlaySong(songID);
  };

  return (
    <div>
      {songData && (
        <Card className="song-card">
          <Row noGutters>
            <Col xs={4} className="">
              <div className="card-layout">
                <Card.Img
                  src={songData.album.images[1].url}
                  className="img-fluid"
                />
                <div>
                  <h3>{username} </h3>
                  <p>{description}</p>
                </div>
              </div>
            </Col>
            <Col xs={8}>
              <Card.Body>
                {isPlaying ? (
                  <div>
                    <img
                      src={pauseButton}
                      onClick={handlePlayPause}
                      alt="pause button"
                      className="pause-button"
                    />
                    <audio autoPlay>
                      <source src={songData.preview_url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <div>
                    <img
                      src={playButton}
                      onClick={handlePlayPause}
                      alt="play button"
                      className="play-button"
                    />
                  </div>
                )}
                <div className="song-info">
                  <div>
                    <Card.Title>{songData.name}</Card.Title>
                    <Card.Text>
                      {songData.artists.map((artist) => artist.name).join(", ")}
                    </Card.Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <button
                      className={`like-button ${isLiked ? "liked" : ""}`}
                      onClick={handleLikeToggle}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} />
                    </button>
                    <span style={{ marginLeft: "5px", paddingRight: "8px" }}>
                      {likes}
                    </span>
                  </div>
                </div>
                <div>
                  <ul className="comments-list">
                    {localComments.map((comment, index) => (
                      <li key={comment._id || index}>
                        <strong>{comment.username}</strong>: {comment.text}
                      </li>
                    ))}
                  </ul>
                  <div className="comments-area">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={commentUsername}
                      onChange={(e) => setCommentUsername(e.target.value)}
                      className="comment-username-input"
                    />
                    <textarea
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="comment-textarea"
                    />
                  </div>

                  <button
                    onClick={submitComment}
                    className="post-comment-button"
                  >
                    Post Comment
                  </button>
                </div>
              </Card.Body>
            </Col>
          </Row>
          <div className="bottom-right-image-container">
            <a
              href={songData.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="bottom-right-image"
            >
              <img src={exportButton} alt="export" className="bottom-image" />
            </a>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SongPost;
