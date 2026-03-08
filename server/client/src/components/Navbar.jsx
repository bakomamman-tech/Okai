import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import Brand from "./Brand";

export default function Navbar({ searchValue = "", onSearchChange, notificationsCount = 0 }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="surface topbar">
      <Brand compact />

      {onSearchChange ? (
        <label className="searchbar">
          <span>Search pulse</span>
          <input
            type="search"
            placeholder="Search posts, people, notes"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
      ) : (
        <div className="topbar-spacer" />
      )}

      <div className="topbar-actions">
        <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`.trim()} to="/feed">
          Feed
        </NavLink>
        <NavLink
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`.trim()}
          to={user?._id ? `/profile/${user._id}` : "/profile"}
        >
          Profile
        </NavLink>
        <span className="notification-chip">Alerts {notificationsCount}</span>
        <button className="ghost-button" type="button" onClick={handleLogout}>
          Log out
        </button>
        <div className="topbar-user">
          <Avatar size="sm" user={user} />
          <div>
            <strong>{user?.name || "Okai"}</strong>
            <span>@{user?.username || "guest"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
