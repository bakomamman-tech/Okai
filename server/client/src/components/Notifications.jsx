// client/src/components/Notifications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get("/api/notifications", { headers });
      setNotifications(res.data);
    };
    fetchNotifications();
  }, []);

  return (
    <div className="notifications">
      {notifications.map(n => (
        <div key={n._id} className={`notification ${n.read ? "read" : "unread"}`}>
          <span>{n.actorId.name} {n.type}ed</span>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
