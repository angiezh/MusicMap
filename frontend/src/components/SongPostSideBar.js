import React from "react";
import "../styles/sidebar.css"; // Import the sidebar styles
import SongPost from "./SongPost";
import Addsongnote from "../assets/Add Song Button.png";
import Closebutton from "../assets/closeicon.png";
import "../styles/songPostSidebar.css";

const SongPostSideBar = ({
  closeSongPostSidebar,
  openAddSongSidebar,
  posts,
  onPlaySong,
  playingSongId,
  handleAddComment,
  handleLike,
}) => {

  
  return (
    <aside className="overlay overlay--add">
      <div className="buttons">
        <button onClick={closeSongPostSidebar} className="close-btn">
          <img src={Closebutton} alt="close button" />
        </button>

        <button
          onClick={() => {
            openAddSongSidebar();
          }}
          className="add-song-btn"
        >
          <img src={Addsongnote} alt="add note" />
        </button>
      </div>
      <div className="overlay__outer">
        <div className="overlay__content">
          <section>
            <div className="overlay__section-text">Songs in this location</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "28px",
              }}
            >
              {posts.map((post, index) => (
                
                <SongPost
                  songID={post.song_id}
                  description={post.description}
                  username={post.username}
                  likes={post.likes}
                  comments={post.comments}
                  {...console.log(post.comments)}
                  key={index}
                  handleAddComment={handleAddComment}
                  handleLike={handleLike}
                  onPlaySong={onPlaySong}
                  playingSongId={playingSongId}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
};

export default SongPostSideBar;
