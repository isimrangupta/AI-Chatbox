import { useState } from "react";

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`msg-row ${isUser ? "msg-row--user" : "msg-row--ai"}`}>

      {/* Avatar — only for AI */}
      {!isUser && (
        <div className="msg-avatar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
      )}

      <div className={`msg-content ${isUser ? "msg-content--user" : "msg-content--ai"}`}>

        {/* Name label */}
        <div className="msg-label">
          {isUser ? "You" : "Aurora"}
        </div>

        {/* Bubble */}
        <div className={`msg-bubble ${isUser ? "msg-bubble--user" : "msg-bubble--ai"} ${message.isError ? "msg-bubble--error" : ""}`}>
          <p className="msg-text">{message.content}</p>
        </div>

        {/* Footer: time + copy */}
        <div className="msg-footer">
          {message.createdAt && (
            <span className="msg-time">{formatTime(message.createdAt)}</span>
          )}
          <button
            className="msg-copy-btn"
            onClick={handleCopy}
            aria-label="Copy message"
            title="Copy"
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </>
            )}
          </button>
        </div>

      </div>

      {/* Avatar — only for user */}
      {isUser && (
        <div className="msg-avatar msg-avatar--user">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      )}

    </div>
  );
}