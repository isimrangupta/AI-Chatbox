import {Trash2} from "lucide-react";
import "../styles/sidebar.css";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function Sidebar({
  open,
  chats,
  activeChat,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  onLogout,
  user,
}) {
  const initials = user
    ? `${user.fullName?.firstName?.[0] ?? ""}${user.fullName?.lastName?.[0] ?? ""}`.toUpperCase()
    : "AU";

  return (
    <aside className={`sidebar ${open ? "open" : "closed"}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="sidebar-logo-text">Aurora</span>
      </div>

      {/* New Chat */}
      <button className="sidebar-new-btn" onClick={onNewChat}>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Chat
      </button>

      {/* Section label */}
      {chats.length > 0 && <div className="sidebar-section-label">Recent</div>}

      {/* Chat list */}
      <div className="sidebar-list">
        {chats.length === 0 ? (
          <div className="sidebar-empty">
            <div className="sidebar-empty-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p>
              No chats yet.
              <br />
              Start a new conversation!
            </p>
          </div>
        ) : (
          chats.map((chat, i) => (
            <div
              key={chat._id}
              className={`sidebar-item ${activeChat === chat._id ? "active" : ""}`}
              onClick={() => onSelectChat(chat._id)}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="sidebar-item-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="sidebar-item-info">
                <div className="sidebar-item-title">{chat.title}</div>
                <div className="sidebar-item-date">
                  {formatDate(chat.lastActivity || chat.createdAt)}
                </div>
              </div>

              <button
                className="delete-chat-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat._id);
                }}
              >
                <Trash2 size={16}/>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {user?.fullName?.firstName} {user?.fullName?.lastName}
            </div>
            <div className="sidebar-user-email">{user?.email}</div>
          </div>
        </div>
        <button className="sidebar-logout-btn" onClick={onLogout}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
