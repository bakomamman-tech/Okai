// client/src/pages/Feed.jsx
import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import StoryViewer from "../components/StoryViewer";
import Navbar from "../components/Navbar";
import Notifications from "../components/Notifications";
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const postsRes = await axios.get("/api/posts", { headers });
      const storiesRes = await axios.get("/api/stories", { headers });

      setPosts(postsRes.data);
      setStories(storiesRes.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <StoryViewer stories={stories} />
      <Notifications />
      <div className="feed">
        {posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
