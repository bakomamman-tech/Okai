// client/src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const userRes = await axios.get(`/api/users/${userId}`, { headers });
      const followersRes = await axios.get(`/api/users/${userId}/followers`, { headers });
      const followingRes = await axios.get(`/api/users/${userId}/following`, { headers });

      setUser(userRes.data);
      setFollowers(followersRes.data);
      setFollowing(followingRes.data);
    };
    fetchProfile();
  }, [userId]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <img src={user.avatar} alt="avatar" />
      <h2>{user.name}</h2>
      <p>@{user.username}</p>
      <p>{user.bio}</p>

      <div className="profile-stats">
        <span>{followers.length} Followers</span>
        <span>{following.length} Following</span>
      </div>

      <div className="followers-list">
        <h3>Followers</h3>
        {followers.map(f => (
          <p key={f._id}>{f.name} (@{f.username})</p>
        ))}
      </div>

      <div className="following-list">
        <h3>Following</h3>
        {following.map(f => (
          <p key={f._id}>{f.name} (@{f.username})</p>
        ))}
      </div>
    </div>
  );
};

export default Profile;
