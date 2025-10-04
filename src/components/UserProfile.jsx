import { useState } from "react";

export default function UserProfile({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("")
    : "G";

  return (
    <div className="user-profile">
      <div className="avatar" onClick={() => setOpen(!open)}>
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="avatar" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {open && (
        <div className="menu">
          <div className="menu-item">{user.name}</div>
          <div className="menu-item small">{user.role}</div>
          <hr />
          <button className="menu-item" onClick={onLogout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
//