import React from "react";
import "../styles/sidebar.css"; // Import the sidebar styles
import SongPost from "./SongPost";

const SongPostSideBar = ({
  closeSongPostSidebar,
  openAddSongSidebar,
  posts,
}) => {
  console.log(posts);
  return (
    <aside className="overlay overlay--add">
      <div className="action-button-container">
        <button onClick={closeSongPostSidebar} position="right">
          close add overlay
        </button>
      </div>
      <div className="overlay__outer">
        <div className="overlay__content">
          <section>
            <div className="overlay__section-text">Songs in this location:</div>
            {posts.map((post, index) => (
              <SongPost
                songID={post.song_id} // Ensure correct property name
                description={post.description} // Ensure correct property name
                key={index}
              />
            ))}
          </section>
        </div>
        <button
          onClick={() => {
            openAddSongSidebar();
          }}
        >
          Add Song at this Location
        </button>
      </div>
    </aside>
  );
};

export default SongPostSideBar;
