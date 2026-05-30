import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
 import { chatService, messageService } from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import "../styles/home.css";
import "../styles/chat.css";

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiTyping, setAiTyping] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);

  const socketRef = useRef(null);

  const activeChatRef = useRef(activeChat);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
  if (!user) return;

  async function loadChats() {
    try {
      const data = await chatService.getChats();

      setChats(data.chats);

      if (data.chats.length > 0) {
        setActiveChat(data.chats[0]._id);
      }
    } catch (err) {
      console.error("Load chats error:", err);
    }
  }

  loadChats();
}, [user]);

  useEffect(() => {
    if (!user) return;

    const socket = io("https://ai-chatbox-904h.onrender.com", { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => console.log("Socket connected ✓"));
    socket.on("connect_error", (err) => console.error("Socket error:", err));

    socket.on("ai-response", ({ content, chat }) => {
      setAiTyping(false);
      setMessages((prev) => ({
        ...prev,
        [chat]: [
          ...(prev[chat] || []),
          { role: "model", content, _id: Date.now(), createdAt: new Date() },
        ],
      }));
    });

    socket.on("ai-error", ({ message }) => {
      setAiTyping(false);
      setMessages((prev) => ({
        ...prev,
        [activeChatRef.current]: [
          ...(prev[activeChatRef.current] || []),
          {
            role: "model",
            content: `⚠️ Error: ${message}`,
            _id: Date.now(),
            isError: true,
            createdAt: new Date(),
          },
        ],
      }));
    });

    return () => socket.disconnect();
  }, [user]);

  const sendMessage = useCallback(
    (content) => {
      if (!activeChat || !content.trim() || !socketRef.current) return;
      setMessages((prev) => ({
        ...prev,
        [activeChat]: [
          ...(prev[activeChat] || []),
          { role: "user", content, _id: Date.now(), createdAt: new Date() },
        ],
      }));
      setAiTyping(true);
      socketRef.current.emit("ai-message", { chat: activeChat, content });
    },
    [activeChat]
  );

  const createChat = async () => {
    const title = newChatTitle.trim() || "New Chat";
    setCreatingChat(true);
    try {
      const data = await chatService.createChat(title);
      const chat = data.chat;
      setChats((prev) => [chat, ...prev]);
      setMessages((prev) => ({ ...prev, [chat._id]: [] }));
      setActiveChat(chat._id);
      setShowNewChatModal(false);
      setNewChatTitle("");
    } catch (err) {
      console.error("Create chat error:", err);
    } finally {
      setCreatingChat(false);
    }
  };


const deleteChat = async (chatId) => {
  try {
    await chatService.deleteChat(chatId);

    const updatedChats = chats.filter(
      (chat) => chat._id !== chatId
    );

    setChats(updatedChats);

    if (activeChat === chatId) {
      setActiveChat(
        updatedChats.length
          ? updatedChats[0]._id
          : null
      );
    }
  } catch (err) {
    console.error(err);
  }
};


  useEffect(() => {
  if (!activeChat) return;

  async function loadMessages() {
    try {
      const data = await messageService.getMessages(activeChat);

      setMessages((prev) => ({
        ...prev,
        [activeChat]: data.messages,
      }));
    } catch (err) {
      console.error("Load messages error:", err);
    }
  }

  loadMessages();
}, [activeChat]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="home-root">
    <Sidebar
  open={sidebarOpen}
  chats={chats}
  activeChat={activeChat}
  onSelectChat={setActiveChat}
  onDeleteChat={deleteChat}
  onNewChat={() => setShowNewChatModal(true)}
  onLogout={handleLogout}
  user={user}
  theme={theme}
  onToggleTheme={toggleTheme}
/>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`home-main ${sidebarOpen ? "with-sidebar" : ""}`}>
        <header className="home-header">
          <button
            className="icon-btn"
            onClick={() => setSidebarOpen((p) => !p)}
            aria-label="Toggle sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div className="home-header-title">
            {activeChat
              ? chats.find((c) => c._id === activeChat)?.title || "Chat"
              : "Aurora"}
          </div>

          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </header>

        <ChatWindow
          messages={messages[activeChat] || []}
          activeChat={activeChat}
          onSend={sendMessage}
          aiTyping={aiTyping}
          onNewChat={() => setShowNewChatModal(true)}
          chatTitle={chats.find((c) => c._id === activeChat)?.title}
        />
      </div>

      {showNewChatModal && (
        <div className="modal-backdrop" onClick={() => setShowNewChatModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Conversation</h3>
              <button className="icon-btn" onClick={() => setShowNewChatModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <p className="modal-subtitle">Give your chat a name (optional)</p>
            <input
              className="modal-input"
              type="text"
              placeholder="e.g. React help, Travel plans…"
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createChat()}
              autoFocus
              maxLength={60}
            />
            <div className="modal-actions">
              <button
                className="modal-btn-secondary"
                onClick={() => setShowNewChatModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-btn-primary"
                onClick={createChat}
                disabled={creatingChat}
              >
                {creatingChat ? <span className="auth-spinner" /> : "Start Chat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



//____________________________________________________________________________________________________



