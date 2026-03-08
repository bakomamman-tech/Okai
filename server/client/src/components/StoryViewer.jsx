import { useState } from "react";
import { resolveAssetUrl } from "../api";
import { formatRelativeTime } from "../utils/time";
import Avatar from "./Avatar";

export default function StoryViewer({ stories, onCreateStory, isSubmitting }) {
  const [image, setImage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image.trim()) {
      return;
    }

    const didCreate = await onCreateStory(image.trim());

    if (didCreate !== false) {
      setImage("");
    }
  };

  return (
    <section className="surface panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Visual rail</span>
          <h2>Stories that disappear in 24 hours</h2>
        </div>
      </div>

      <form className="field-row story-form" onSubmit={handleSubmit}>
        <input
          className="text-field"
          type="url"
          placeholder="Paste a story image URL"
          value={image}
          onChange={(event) => setImage(event.target.value)}
        />
        <button className="chip-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add story"}
        </button>
      </form>

      <div className="story-grid">
        {stories.length ? (
          stories.map((story) => (
            <article key={story._id} className="story-card">
              <img
                className="story-image"
                src={resolveAssetUrl(story.image)}
                alt={`${story.user?.name || "Okai"} story`}
              />
              <div className="story-overlay">
                <div className="story-meta">
                  <Avatar size="xs" user={story.user} />
                  <div>
                    <strong>{story.user?.name || "Okai member"}</strong>
                    <span>{formatRelativeTime(story.createdAt)}</span>
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <strong>No stories yet</strong>
            <p>Drop the first visual card into the rail.</p>
          </div>
        )}
      </div>
    </section>
  );
}
