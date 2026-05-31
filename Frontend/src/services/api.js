const BASE_URL = "https://ai-chatbox-904h.onrender.com/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("aurora-token");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: "include",
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");

  // ✅ Token response mein aaye toh save karo
  if (data.token) {
    localStorage.setItem("aurora-token", data.token);
  }

  return data;
}

export const authService = {
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
};

export const chatService = {
  createChat: (title) =>
    request("/chat", { method: "POST", body: JSON.stringify({ title }) }),
  getChats: () => request("/chat"),
  deleteChat: (chatId) =>
    request(`/chat/${chatId}`, { method: "DELETE" }),
};

export const messageService = {
  getMessages: (chatId) => request(`/message/${chatId}`),
};