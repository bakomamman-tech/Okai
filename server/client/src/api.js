export const SESSION_STORAGE_KEY = "okai.session";

const configuredBaseUrl = import.meta.env.VITE_API_URL || "/api";
const API_BASE_URL = configuredBaseUrl.replace(/\/$/, "");
const SERVER_ORIGIN = API_BASE_URL.startsWith("http")
  ? new URL(API_BASE_URL).origin
  : window.location.origin;

export const readStoredSession = () => {
  try {
    const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);
    return rawSession ? JSON.parse(rawSession) : null;
  } catch (_error) {
    return null;
  }
};

const buildUrl = (path) => `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const request = async (path, options = {}) => {
  const session = readStoredSession();
  const headers = new Headers(options.headers || {});
  const hasBody = options.body !== undefined;
  const isFormData = hasBody && options.body instanceof FormData;

  if (hasBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (session?.token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
    body: !hasBody || isFormData ? options.body : JSON.stringify(options.body),
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};

export const resolveAssetUrl = (assetPath) => {
  if (!assetPath) {
    return "";
  }

  if (/^(https?:)?\/\//i.test(assetPath) || assetPath.startsWith("data:")) {
    return assetPath;
  }

  if (assetPath.startsWith("/")) {
    return `${SERVER_ORIGIN}${assetPath}`;
  }

  return `${SERVER_ORIGIN}/${assetPath}`;
};

export const api = {
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  getProfile: () => request("/profile"),
  updateProfile: (payload) => request("/profile", { method: "PUT", body: payload }),
  getUserProfile: (userId) => request(`/users/${userId}`),
  followUser: (userId) => request(`/users/${userId}/follow`, { method: "POST" }),
  unfollowUser: (userId) => request(`/users/${userId}/unfollow`, { method: "POST" }),
  getFollowers: (userId) => request(`/users/${userId}/followers`),
  getFollowing: (userId) => request(`/users/${userId}/following`),
  getPosts: () => request("/posts"),
  createPost: (payload) => request("/posts", { method: "POST", body: payload }),
  toggleLike: (postId) => request(`/posts/${postId}/like`, { method: "PUT" }),
  addComment: (postId, text) =>
    request(`/posts/${postId}/comment`, { method: "POST", body: { text } }),
  getStories: () => request("/stories"),
  createStory: (image) => request("/stories", { method: "POST", body: { image } }),
  getNotifications: () => request("/notifications"),
  markNotificationRead: (notificationId) =>
    request(`/notifications/${notificationId}/read`, { method: "PUT" }),
};
