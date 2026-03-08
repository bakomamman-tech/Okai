const normalizeId = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (value._id) {
    return String(value._id);
  }

  return String(value);
};

const toPlainObject = (value) => {
  if (!value) {
    return null;
  }

  return typeof value.toObject === "function" ? value.toObject() : value;
};

const serializeUser = (user, extra = {}) => {
  const source = toPlainObject(user);

  if (!source) {
    return null;
  }

  const id = normalizeId(source._id);
  const followersCount = Array.isArray(source.followers)
    ? source.followers.length
    : source.followersCount || 0;
  const followingCount = Array.isArray(source.following)
    ? source.following.length
    : source.followingCount || 0;

  return {
    id,
    _id: id,
    name: source.name,
    username: source.username,
    email: source.email,
    avatar: source.avatar || "",
    cover: source.cover || "",
    bio: source.bio || "",
    headline: source.headline || "",
    location: source.location || "",
    website: source.website || "",
    role: source.role || "member",
    followersCount,
    followingCount,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
    ...extra,
  };
};

const serializeStory = (story) => {
  const source = toPlainObject(story);

  if (!source) {
    return null;
  }

  const id = normalizeId(source._id);

  return {
    id,
    _id: id,
    image: source.image,
    createdAt: source.createdAt,
    user: serializeUser(source.userId),
  };
};

const serializeComment = (comment) => {
  const source = toPlainObject(comment);

  if (!source) {
    return null;
  }

  const id = normalizeId(source._id) || `${normalizeId(source.user)}-${source.createdAt}`;

  return {
    id,
    _id: id,
    text: source.text,
    createdAt: source.createdAt,
    user: serializeUser(source.user),
  };
};

const serializePost = (post, viewerId) => {
  const source = toPlainObject(post);

  if (!source) {
    return null;
  }

  const id = normalizeId(source._id);
  const likes = Array.isArray(source.likes) ? source.likes.map(normalizeId) : [];
  const normalizedViewerId = normalizeId(viewerId);
  const comments = Array.isArray(source.comments)
    ? source.comments.map(serializeComment).filter(Boolean)
    : [];

  return {
    id,
    _id: id,
    content: source.content || "",
    image: source.image || "",
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
    author: serializeUser(source.author || source.userId),
    likes,
    likeCount: likes.length,
    likedByViewer: normalizedViewerId ? likes.includes(normalizedViewerId) : false,
    comments,
    commentCount: comments.length,
  };
};

const serializeNotification = (notification) => {
  const source = toPlainObject(notification);

  if (!source) {
    return null;
  }

  const id = normalizeId(source._id);

  return {
    id,
    _id: id,
    type: source.type,
    read: Boolean(source.read),
    entityId: normalizeId(source.entityId),
    createdAt: source.createdAt,
    actor: serializeUser(source.actorId),
  };
};

module.exports = {
  normalizeId,
  serializeComment,
  serializeNotification,
  serializePost,
  serializeStory,
  serializeUser,
};
