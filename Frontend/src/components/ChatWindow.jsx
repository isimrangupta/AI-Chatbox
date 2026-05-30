import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({
  messages,
  activeChat,
  onSend,
  aiTyping,
  onNewChat,
  
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  // Auto resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || !activeChat) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // No chat selected
  if (!activeChat) {
    return (
      <div className="chat-empty-root">
        <div className="chat-empty-content">
          <div className="chat-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h2 className="chat-empty-title">Sat Sri Akal! 🌟</h2>
          <p className="chat-empty-subtitle">
            Aurora hazir hai — ki seva kar sakdi haan?<br/>
            <span>Start a new chat to begin!</span>
          </p>
          <button className="chat-empty-btn" onClick={onNewChat}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Conversation
          </button>

          {/* Suggestion chips */}
          <div className="chat-suggestions">
            {[
              "✨ Help me write code",
              "🌍 Translate something",
              "💡 Explain a concept",
              "📝 Review my text",
            ].map((s) => (
              <div key={s} className="chat-suggestion-chip">{s}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-root">

      {/* Messages area */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-start-hint">
            <div className="chat-start-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <p>Send a message to start chatting with Aurora!</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={msg._id || i} message={msg} />
        ))}

        {/* AI typing indicator */}
        {aiTyping && (
          <div className="chat-typing">
            <div className="chat-typing-avatar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="chat-typing-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="chat-input-area">
        <div className="chat-input-box">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Message Aurora… (Enter to send, Shift+Enter for new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={aiTyping}
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || aiTyping}
            aria-label="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <p className="chat-input-hint">
          Aurora can make mistakes. Verify important information.
        </p>
      </div>

    </div>
  );
}