import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Notifications from "../components/Notifications";
import PostCard from "../components/PostCard";
import PostComposer from "../components/PostComposer";
import StoryViewer from "../components/StoryViewer";

export default function Feed() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);
  const [activeNotificationId, setActiveNotificationId] = useState("");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [postsData, storiesData, notificationsData, profileData] = await Promise.all([
          api.getPosts(),
          api.getStories(),
          api.getNotifications(),
          api.getProfile(),
        ]);

        if (!ignore) {
          startTransition(() => {
            setPosts(postsData.posts);
            setStories(storiesData.stories);
            setNotifications(notificationsData.notifications);
            setProfile(profileData.user);
          });
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredPosts = posts.filter((post) => {
    const query = deferredSearch.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [post.author?.name, post.author?.username, post.content]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

  const unreadCount = notifications.filter((entry) => !entry.read).length;

  const handleCreatePost = async (payload) => {
    try {
      setStatus("");
      setError("");
      setIsSubmittingPost(true);
      const data = await api.createPost(payload);
      setPosts((currentPosts) => [data.post, ...currentPosts]);
      setStatus("Post published.");
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleCreateStory = async (image) => {
    try {
      setStatus("");
      setError("");
      setIsSubmittingStory(true);
      const data = await api.createStory(image);
      setStories((currentStories) => [data.story, ...currentStories]);
      setStatus("Story added to the rail.");
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setIsSubmittingStory(false);
    }
  };

  const handleMarkRead = async (notificationId) => {
    try {
      setActiveNotificationId(notificationId);
      const data = await api.markNotificationRead(notificationId);
      setNotifications((currentNotifications) =>
        currentNotifications.map((entry) =>
          entry._id === notificationId ? data.notification : entry
        )
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setActiveNotificationId("");
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((currentPosts) =>
      currentPosts.map((entry) => (entry._id === updatedPost._id ? updatedPost : entry))
    );
  };

  const heroMetrics = [
    { label: "Followers", value: profile?.followersCount || 0 },
    { label: "Following", value: profile?.followingCount || 0 },
    { label: "Unread alerts", value: unreadCount },
    { label: "Stories live", value: stories.length },
  ];

  if (isLoading) {
    return (
      <div className="app-shell">
        <div className="page-loader">
          <div className="loader-orb" />
          <p>Building your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar
        searchValue={search}
        onSearchChange={setSearch}
        notificationsCount={unreadCount}
      />

      <main className="dashboard">
        <section className="dashboard-main">
          <section className="surface hero-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Daily pulse</span>
                <h1>{profile?.headline || "Shape the conversation."}</h1>
              </div>
            </div>
            <p className="hero-copy">
              {profile?.bio || "Use Okai to keep your circle updated without the clutter."}
            </p>
            <div className="metric-grid">
              {heroMetrics.map((metric) => (
                <article key={metric.label} className="metric-card">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </article>
              ))}
            </div>
          </section>

          <StoryViewer
            stories={stories}
            onCreateStory={handleCreateStory}
            isSubmitting={isSubmittingStory}
          />

          <PostComposer onCreate={handleCreatePost} isSubmitting={isSubmittingPost} />

          {status && <div className="banner">{status}</div>}
          {error && <div className="banner banner-error">{error}</div>}

          <section className="feed-list">
            {filteredPosts.length ? (
              filteredPosts.map((post) => (
                <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />
              ))
            ) : (
              <div className="surface empty-state">
                <strong>No posts match this search</strong>
                <p>Try another keyword or publish a new update.</p>
              </div>
            )}
          </section>
        </section>

        <aside className="dashboard-side">
          <Notifications
            notifications={notifications}
            onMarkRead={handleMarkRead}
            activeId={activeNotificationId}
          />

          <section className="surface panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Profile snapshot</span>
                <h2>{profile?.name || "Your profile"}</h2>
              </div>
            </div>
            <div className="profile-list">
              <div className="profile-line">
                <span>Username</span>
                <strong>@{profile?.username || "okai"}</strong>
              </div>
              <div className="profile-line">
                <span>Location</span>
                <strong>{profile?.location || "Not set"}</strong>
              </div>
              <div className="profile-line">
                <span>Website</span>
                <strong>{profile?.website || "No site yet"}</strong>
              </div>
            </div>
            <p className="muted-copy">Update the rest of your identity from the profile editor.</p>
          </section>
        </aside>
      </main>
    </div>
  );
}
