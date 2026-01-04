// client/src/components/PostCard.jsx
import React, { useState } from "react";
import axios from "axios";

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes.length);
  const [comments, setComments] = useState(post.comments);

  const toggleLike = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.put(`/api/posts/${post._id}/like`, {}, { headers });
    setLikes(res.data.likes.length);
  };

  const addComment = async text => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.post(
      `/api/posts/${post._id}/comment`,
      { text },
      { headers }
    );
    setComments(res.data.comments);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img src={post.userId.avatar} alt="avatar" />
        <span>{post.userId.name}</span>
      </div>
      <p>{post.text}</p>
      {post.image && <img src={post.image} alt="post" />}
      <div className="post-actions">
        <button onClick={toggleLike}>👍 {likes}</button>
      </div>
      <div className="comments">
        {comments.map(c => (
          <p key={c._id}>{c.text}</p>
        ))}
      </div>
    </div>
  );
};

export default PostCard;
