import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, resolveAssetUrl } from "../api";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import Navbar from "../components/Navbar";

const createDraft = (user) => ({
  name: user?.name || "",
  bio: user?.bio || "",
  headline: user?.headline || "",
  location: user?.location || "",
  website: user?.website || "",
  avatar: user?.avatar || "",
  cover: user?.cover || "",
});

export default function Profile() {
  const { userId } = useParams();
  const { updateUser, user: currentUser } = useAuth();
  const resolvedUserId = userId || currentUser?._id;
  const [profile, setProfile] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [draft, setDraft] = useState(createDraft(currentUser));
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFollowingBusy, setIsFollowingBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      if (!resolvedUserId) {
        return;
      }

      try {
        setError("");

        const [profileData, followersData, followingData] = await Promise.all([
          api.getUserProfile(resolvedUserId),
          api.getFollowers(resolvedUserId),
          api.getFollowing(resolvedUserId),
        ]);

        if (!ignore) {
          setProfile(profileData.user);
          setFollowers(followersData.followers);
          setFollowing(followingData.following);
          setDraft(createDraft(profileData.user));
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      }
    };

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [resolvedUserId]);

  const isOwnProfile = resolvedUserId === currentUser?._id;

  const handleDraftChange = (field, value) => {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setStatus("");
      setError("");
      setIsSaving(true);
      const data = await api.updateProfile(draft);
      setProfile((currentProfile) => ({ ...currentProfile, ...data.user, isCurrentUser: true }));
      setDraft(createDraft(data.user));
      updateUser(data.user);
      setIsEditing(false);
      setStatus("Profile updated.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!profile) {
      return;
    }

    try {
      setStatus("");
      setError("");
      setIsFollowingBusy(true);

      const data = profile.isFollowing
        ? await api.unfollowUser(profile._id)
        : await api.followUser(profile._id);

      setProfile((currentProfile) => ({
        ...currentProfile,
        ...data.user,
      }));
      updateUser({
        ...currentUser,
        ...data.currentUser,
      });

      if (profile.isFollowing) {
        setFollowers((currentFollowers) =>
          currentFollowers.filter((entry) => entry._id !== currentUser._id)
        );
        setStatus("You unfollowed this profile.");
      } else {
        setFollowers((currentFollowers) => {
          if (currentFollowers.some((entry) => entry._id === currentUser._id)) {
            return currentFollowers;
          }

          return [{ ...currentUser }, ...currentFollowers];
        });
        setStatus("You are now following this profile.");
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsFollowingBusy(false);
    }
  };

  if (!profile) {
    return (
      <div className="app-shell">
        <div className="page-loader">
          <div className="loader-orb" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar notificationsCount={0} />

      <main className="profile-layout">
        <section className="surface profile-hero">
          <div
            className="profile-cover"
            style={
              profile.cover
                ? { backgroundImage: `url(${resolveAssetUrl(profile.cover)})` }
                : undefined
            }
          />

          <div className="profile-summary">
            <Avatar size="xl" user={profile} className="profile-avatar" />
            <div className="profile-identity">
              <span className="eyebrow">Profile</span>
              <h1>{profile.name}</h1>
              <p>@{profile.username}</p>
              <strong>{profile.headline || "Member"}</strong>
            </div>
            <div className="profile-actions">
              {isOwnProfile ? (
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => setIsEditing((open) => !open)}
                >
                  {isEditing ? "Close editor" : "Edit profile"}
                </button>
              ) : (
                <button
                  className="primary-button"
                  type="button"
                  onClick={handleFollowToggle}
                  disabled={isFollowingBusy}
                >
                  {isFollowingBusy
                    ? "Saving..."
                    : profile.isFollowing
                      ? "Unfollow"
                      : "Follow"}
                </button>
              )}
            </div>
          </div>

          <div className="profile-metrics">
            <article className="metric-card">
              <strong>{followers.length}</strong>
              <span>Followers</span>
            </article>
            <article className="metric-card">
              <strong>{following.length}</strong>
              <span>Following</span>
            </article>
            <article className="metric-card">
              <strong>{profile.location || "Unset"}</strong>
              <span>Location</span>
            </article>
          </div>
        </section>

        {status && <div className="banner">{status}</div>}
        {error && <div className="banner banner-error">{error}</div>}

        <section className="profile-grid">
          <article className="surface panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">About</span>
                <h2>Identity card</h2>
              </div>
            </div>
            <div className="profile-list">
              <div className="profile-line">
                <span>Bio</span>
                <strong>{profile.bio || "No bio yet"}</strong>
              </div>
              <div className="profile-line">
                <span>Website</span>
                <strong>{profile.website || "No website yet"}</strong>
              </div>
              <div className="profile-line">
                <span>Email</span>
                <strong>{profile.email || "Private"}</strong>
              </div>
            </div>
          </article>

          {isOwnProfile && isEditing && (
            <article className="surface panel">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">Editor</span>
                  <h2>Refresh your presentation</h2>
                </div>
              </div>
              <form className="stack-form" onSubmit={handleSave}>
                <input
                  className="text-field"
                  type="text"
                  placeholder="Name"
                  value={draft.name}
                  onChange={(event) => handleDraftChange("name", event.target.value)}
                />
                <input
                  className="text-field"
                  type="text"
                  placeholder="Headline"
                  value={draft.headline}
                  onChange={(event) => handleDraftChange("headline", event.target.value)}
                />
                <textarea
                  className="textarea-field"
                  placeholder="Bio"
                  value={draft.bio}
                  onChange={(event) => handleDraftChange("bio", event.target.value)}
                />
                <input
                  className="text-field"
                  type="text"
                  placeholder="Location"
                  value={draft.location}
                  onChange={(event) => handleDraftChange("location", event.target.value)}
                />
                <input
                  className="text-field"
                  type="url"
                  placeholder="Website"
                  value={draft.website}
                  onChange={(event) => handleDraftChange("website", event.target.value)}
                />
                <input
                  className="text-field"
                  type="url"
                  placeholder="Avatar URL"
                  value={draft.avatar}
                  onChange={(event) => handleDraftChange("avatar", event.target.value)}
                />
                <input
                  className="text-field"
                  type="url"
                  placeholder="Cover URL"
                  value={draft.cover}
                  onChange={(event) => handleDraftChange("cover", event.target.value)}
                />
                <button className="primary-button wide-button" type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              </form>
            </article>
          )}

          <article className="surface panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Community</span>
                <h2>Followers</h2>
              </div>
            </div>
            <div className="people-list">
              {followers.length ? (
                followers.map((entry) => (
                  <div key={entry._id} className="person-row">
                    <Avatar size="sm" user={entry} />
                    <div>
                      <strong>{entry.name}</strong>
                      <span>@{entry.username}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <strong>No followers yet</strong>
                  <p>This profile has not built its circle yet.</p>
                </div>
              )}
            </div>
          </article>

          <article className="surface panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Network</span>
                <h2>Following</h2>
              </div>
            </div>
            <div className="people-list">
              {following.length ? (
                following.map((entry) => (
                  <div key={entry._id} className="person-row">
                    <Avatar size="sm" user={entry} />
                    <div>
                      <strong>{entry.name}</strong>
                      <span>@{entry.username}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <strong>Following list is empty</strong>
                  <p>There are no linked profiles to show yet.</p>
                </div>
              )}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
