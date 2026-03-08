import { useEffect, useState } from "react";
import { api, resolveAssetUrl } from "../api";
import { formatRelativeTime } from "../utils/time";
import Avatar from "./Avatar";

export default function PostCard({ post, onUpdate }) {
  const [localPost, setLocalPost] = useState(post);
  const [comment, setComment] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  const syncPost = (updatedPost) => {
    setLocalPost(updatedPost);
    onUpdate?.(updatedPost);
  };

  const handleLike = async () => {
    try {
      setError("");
      setIsLiking(true);
      const data = await api.toggleLike(localPost._id);
      syncPost(data.post);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (event) => {
    event.preventDefault();

    if (!comment.trim()) {
      return;
    }

    try {
      setError("");
      setIsCommenting(true);
      const data = await api.addComment(localPost._id, comment);
      syncPost(data.post);
      setComment("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <article className="surface post-card">
      <div className="post-header">
        <div className="post-author">
          <Avatar size="md" user={localPost.author} />
          <div>
            <strong>{localPost.author?.name}</strong>
            <span>@{localPost.author?.username}</span>
          </div>
        </div>
        <span className="post-time">{formatRelativeTime(localPost.createdAt)}</span>
      </div>

      {localPost.content && <p className="post-body">{localPost.content}</p>}

      {localPost.image && (
        <img
          className="post-media"
          src={resolveAssetUrl(localPost.image)}
          alt={`${localPost.author?.name || "Okai"} post`}
        />
      )}

      <div className="post-stats">
        <span>{localPost.likeCount} likes</span>
        <span>{localPost.commentCount} comments</span>
      </div>

      <div className="action-row">
        <button className="secondary-button" type="button" onClick={handleLike} disabled={isLiking}>
          {localPost.likedByViewer ? "Unlike" : "Like"}
        </button>
      </div>

      <div className="comment-list">
        {localPost.comments.slice(0, 3).map((entry) => (
          <div key={entry._id} className="comment-item">
            <Avatar size="xs" user={entry.user} />
            <div>
              <strong>{entry.user?.name || "Okai member"}</strong>
              <p>{entry.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form className="comment-form" onSubmit={handleComment}>
        <input
          className="text-field"
          type="text"
          placeholder="Add a comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <button className="chip-button" type="submit" disabled={isCommenting}>
          {isCommenting ? "Posting..." : "Comment"}
        </button>
      </form>

      {error && <p className="field-error">{error}</p>}
    </article>
  );
}
