import React from "react";
import "../styles/sidebar.css"; // Import the sidebar styles
import SongPost from "./SongPost";
import Addsongnote from "../assets/Add Song Button.png";
import Closebutton from "../assets/closeicon.png";

const SongPostSideBar = ({
  closeSongPostSidebar,
  openAddSongSidebar,
  posts,
}) => {
  console.log(posts);
  return (
    <aside className="overlay overlay--add">

    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        
        <button onClick={closeSongPostSidebar} position="right"
        style={{
          background: 'none',
          border: 'none',
          marginLeft:"20",
          padding: '0',
          cursor: 'pointer', 
        }}
        >
          <img src={Closebutton} alt="add note" />
        </button>

        <button
          onClick={() => {
            openAddSongSidebar();
          }}
          style={{
            background: 'none',
            border: 'none',
            padding: '0',
            cursor: 'pointer', 
          }}
        >
           <img src={Addsongnote} alt="add note" />
        </button>
    </div>


      <div className="overlay__outer">
        <div className="overlay__content">
          <section>
            <div className="overlay__section-text" style={{ fontSize: '28px', textAlign:"center", fontWeight:"bold", marginBottom:"15px"}}>Songs in this location</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              {posts.map((post, index) => (
                <SongPost
                  songID={post.song_id}
                  description={post.description}
                  username={post.username}
                  likes={post.likes}
                  comments={JSON.parse(post.comments)}
                  key={index}
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
