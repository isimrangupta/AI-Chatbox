const BASE_URL = "http://localhost:3000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
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
    request("/chat", {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  getChats: () =>
    request("/chat"),

  deleteChat: (chatId) =>
    request(`/chat/${chatId}`, {
      method: "DELETE",
    }),
};

export const messageService = {
  getMessages: (chatId) =>
    request(`/messages/${chatId}`),
};