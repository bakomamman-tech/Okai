import Avatar from "./Avatar";
import { formatRelativeTime } from "../utils/time";

const messagesByType = {
  like: "liked your post",
  comment: "commented on your post",
  follow: "started following you",
};

export default function Notifications({ notifications, onMarkRead, activeId }) {
  return (
    <section className="surface panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Inbox</span>
          <h2>Signal desk</h2>
        </div>
      </div>

      <div className="notification-list">
        {notifications.length ? (
          notifications.map((notification) => (
            <article
              key={notification._id}
              className={`notification-item ${notification.read ? "is-read" : "is-unread"}`}
            >
              <Avatar size="sm" user={notification.actor} />
              <div className="notification-copy">
                <strong>{notification.actor?.name || "Someone"}</strong>
                <p>{messagesByType[notification.type] || "interacted with your profile"}</p>
                <span>{formatRelativeTime(notification.createdAt)}</span>
              </div>
              {!notification.read && (
                <button
                  className="chip-button"
                  type="button"
                  onClick={() => onMarkRead(notification._id)}
                  disabled={activeId === notification._id}
                >
                  {activeId === notification._id ? "Saving..." : "Mark read"}
                </button>
              )}
            </article>
          ))
        ) : (
          <div className="empty-state">
            <strong>No fresh alerts</strong>
            <p>Your likes, comments, and follows will show up here.</p>
          </div>
        )}
      </div>
    </section>
  );
}
