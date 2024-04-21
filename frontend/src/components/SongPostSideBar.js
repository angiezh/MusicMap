import "../styles/sidebar.css";
import SongPost from "./SongPost";

const SongPostSideBar = ({
  closeSongPostSidebar,
  openAddSongSidebar,
  posts,
}) => {
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
                song={post.song}
                description={post.description}
                key={index}
              />
            ))}
          </section>
        </div>
        <button
          onClick={() => {
            closeSongPostSidebar();
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
