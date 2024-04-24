import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import "../styles/sidebar.css";

const SongPost = ({ songID, description, username, comments, likes }) => {
  const [accessToken, setAccessToken] = useState('');
  const [songData, setSongData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const SPOTIFY_CLIENT_ID = "cd433caa648d451aa7bbdccaea7658a6";
  const SPOTIFY_CLIENT_SECRET = "5069acac77184a78a302939392c4d9ec";

  useEffect(() => {
    fetchAccessToken();
  }, []);

  const fetchAccessToken = async () => {
    try {
      const authParameters = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`
      };

      const response = await fetch('https://accounts.spotify.com/api/token', authParameters);
      const data = await response.json();
      setAccessToken(data.access_token);
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  const fetchSongData = async () => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/tracks/${songID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      setSongData(data);
    } catch (error) {
      console.error('Error fetching song data:', error);
    }
  };

  useEffect(() => {
    if (accessToken && songID) {
      fetchSongData();
    }
  }, [accessToken, songID]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      {songData && (
        <Card className="song-card">
          <Row noGutters>
            <Col xs={4}>
              <Card.Img src={songData.album.images[1].url} className="img-fluid" />
            </Col>
            <Col xs={8}>
              <Card.Body>
                <Card.Title>{songData.name}</Card.Title>
                <Card.Text>{songData.artists.map(artist => artist.name).join(', ')}</Card.Text>
                <Button variant="primary" onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</Button>
                {isPlaying && (
                  <audio controls autoPlay>
                    <source src={songData.preview_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                <h3>{username} </h3>
                <p>{description}</p>
                <h4>Likes: {likes}</h4>
                <ul>
                  {comments && Array.isArray(comments) && comments.map((comment, index) => (
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
