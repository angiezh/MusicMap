import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import likeIcon from "../assets/like-icon.png";
import "../styles/sidebar.css";
import playButton from "../assets/play-button.png";
import pauseButton from "../assets/pause-button.png";

const SongPost = ({
  songID,
  description,
  username,
  comments,
  likes,
  onPlaySong,
  playingSongId,
  handleAddComment,
  handleLike
}) => {
  const isPlaying = songID === playingSongId;
  const [accessToken, setAccessToken] = useState("");
  const [songData, setSongData] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentUsername, setCommentUsername] = useState("");
  // const [isPlaying, setIsPlaying] = useState(false);

  let parsedComments;
  try {
    parsedComments = JSON.parse(comments);
  } catch (error) {
    console.error('Failed to parse comments:', error);
    parsedComments = [];  // Default to an empty array if parsing fails
  }

  const SPOTIFY_CLIENT_ID = "cd433caa648d451aa7bbdccaea7658a6";
  const SPOTIFY_CLIENT_SECRET = "5069acac77184a78a302939392c4d9ec";

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
    if (!commentText.trim()) return;
    handleAddComment(songID, commentText, commentUsername);
    setCommentText('');
    setCommentUsername('');
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
                {/* Like button next to the album art */}
                <img
                  src={likeIcon}
                  alt="Like"
                  className="like-button"
                  onClick={() => handleLike(songID)}
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
                <Card.Title>{songData.name}</Card.Title>
                <Card.Text>
                  {songData.artists.map((artist) => artist.name).join(", ")}
                </Card.Text>
                {/* <Button variant="primary" onClick={handlePlayPause}>
                  {isPlaying ? "Pause" : "Play"}
                </Button> */}

                <h4>Likes: {likes}</h4>
                {/* Comment form */}
                <input
                  type="text"
                  placeholder="Your name"
                  value={commentUsername}
                  onChange={(e) => setCommentUsername(e.target.value)}
                  className="commenter-name-input"
                />
                <textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="comment-textarea"
                />
                <button onClick={submitComment} className="submit-comment-btn">
                  Post Comment
                </button>

                {/* <ul>
                  {comments.map((comment, index) => (
                    <li key={index}>
                      <strong>{comment.username}</strong>: {comment.text}
                    </li>
                  ))}
                </ul> */}
                <ul>
                  {Array.isArray(parsedComments) && parsedComments.map((comment, index) => (
                    <li key={index}>
                      <strong>{comment.username}</strong>: {comment.text}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default SongPost;
