// client/src/components/StoryViewer.jsx
import React from "react";

const StoryViewer = ({ stories }) => {
  return (
    <div className="story-viewer">
      {stories.map(story => (
        <div key={story._id} className="story">
          <img src={story.image} alt="story" />
          <span>{story.userId.name}</span>
        </div>
      ))}
    </div>
  );
};

export default StoryViewer;
