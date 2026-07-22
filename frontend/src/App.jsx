import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import confetti from "canvas-confetti";
import {
  addPost,
  deletePost,
  saveDraft,
  deleteDraft,
  publishDraft,
  setPosts,
  setDrafts,
} from "./features/posts/postSlice";

import "./App.css";

function App() {
  const dispatch = useDispatch();

  const publishedPosts = useSelector((state) => state.posts.posts);
  const drafts = useSelector((state) => state.posts.drafts);

  const [post, setPost] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [media, setMedia] = useState(null);

  const platformData = {
    Twitter: { limit: 280, emoji: "🐦" },
    Instagram: { limit: 2200, emoji: "📸" },
    LinkedIn: { limit: 3000, emoji: "💼" },
  };

  // Select/Unselect Platform
  const togglePlatform = (platform) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((item) => item !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  // Upload Image
  const handleMediaUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setMedia(URL.createObjectURL(file));
    }
  };

  // Delete only image
  const deletePublishedImage = (postId) => {
    alert(
      "This image delete only works with local state. We'll connect it to Redux later."
    );
  };

  // Delete Post
  const deletePublishedPost = (postId) => {
    dispatch(deletePost(postId));
  };

  // Save Draft
  const handleSaveDraft = () => {
    if (!post.trim()) {
      alert("Write something before saving!");
      return;
    }

    const draft = {
      id: Date.now(),
      content: post,
      platforms: [...platforms],
      media,
    };

    dispatch(saveDraft(draft));

    alert("Draft Saved Successfully! 📝");

    setPost("");
    setPlatforms([]);
    setMedia(null);
  };

  // Publish Post
  const handlePublish = async () => {
    if (!post.trim()) {
      alert("Please write something magical first! ✨");
      return;
    }

    if (platforms.length === 0) {
      alert("Please select at least one platform!");
      return;
    }

    const invalidPlatform = platforms.find(
      (platform) => post.length > platformData[platform].limit
    );

    if (invalidPlatform) {
      alert(`Your post is too long for ${invalidPlatform}!`);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          content: post,
          platforms,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        confetti({
          particleCount: 180,
          spread: 100,
          origin: { y: 0.6 },
        });

        const newPost = {
          id: Date.now(),
          content: post,
          platforms: [...platforms],
          media,
        };

        dispatch(addPost(newPost));

        alert("🎉 Post Published!");

        setPost("");
        setPlatforms([]);
        setMedia(null);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);

      alert("Backend not running!");
    }
  };
    return (
    <div className="app">
      {/* HEADER */}
      <header>
        <h1>✨ PostPop ✨</h1>

        <p>
          Create once. Share your magic everywhere. 🌈
        </p>
      </header>

      {/* CREATOR AREA */}
      <main className="creator-card">
        {/* LEFT SIDE */}
        <section className="composer">
          <h2>Create your post 🦋</h2>

          <textarea
            placeholder="What's floating around in your mind? 💭"
            value={post}
            onChange={(event) =>
              setPost(event.target.value)
            }
          />

          <p className="character-count">
            ✍️ {post.length} characters
          </p>

          {/* IMAGE UPLOAD */}
          <div className="media-upload">
            <label htmlFor="media">
              📸 Add a magical photo
            </label>

            <input
              type="file"
              id="media"
              accept="image/*"
              onChange={handleMediaUpload}
            />

            {media && (
              <div className="uploaded-media">
                <img
                  src={media}
                  alt="Uploaded preview"
                />

                <button
                  type="button"
                  onClick={() => setMedia(null)}
                >
                  ✕ Remove
                </button>
              </div>
            )}
          </div>

          {/* PLATFORMS */}
          <h3>
            Where should your magic go? ✨
          </h3>

          <div className="platforms">
            {Object.keys(platformData).map(
              (platform) => (
                <button
                  type="button"
                  key={platform}
                  className={
                    platforms.includes(platform)
                      ? "platform selected"
                      : "platform"
                  }
                  onClick={() =>
                    togglePlatform(platform)
                  }
                >
                  {platformData[platform].emoji}{" "}
                  {platform}
                </button>
              )
            )}
          </div>

          {/* VALIDATION */}
          <div className="validation">
            {platforms.map((platform) => {
              const limit =
                platformData[platform].limit;

              const valid =
                post.length <= limit;

              return (
                <p
                  key={platform}
                  className={
                    valid
                      ? "valid"
                      : "invalid"
                  }
                >
                  {platformData[platform].emoji}{" "}
                  {platform}: {post.length}/{limit}{" "}
                  {valid
                    ? "✓ Ready"
                    : "⚠️ Too long!"}
                </p>
              );
            })}
          </div>

          {/* SAVE DRAFT */}
          <button
            className="publish-button"
            onClick={handleSaveDraft}
          >
            💾 Save Draft
          </button>

          {/* PUBLISH */}
          <button
            className="publish-button"
            onClick={handlePublish}
          >
            🚀 Publish the Magic
          </button>
        </section>

        {/* LIVE PREVIEW */}
        <section className="preview">
          <h2>Live Preview 👀</h2>

          <div className="preview-post">
            <div className="avatar">
              🌸
            </div>

            <div className="preview-content">
              <strong>You ✨</strong>

              <p>
                {post ||
                  "Your magical creation will appear here..."}
              </p>

              {media && (
                <img
                  className="preview-image"
                  src={media}
                  alt="Preview"
                />
              )}
            </div>
          </div>
        </section>
      </main>
            {/* DRAFTS */}
      {drafts.length > 0 && (
        <section className="published-section">
          <h2>📝 Saved Drafts</h2>

          <div className="published-grid">
            {drafts.map((draft) => (
              <article
                className="published-post"
                key={draft.id}
              >
                <div className="published-header">
                  <span className="avatar">📝</span>
                  <strong>Draft</strong>
                </div>

                <p>{draft.content}</p>

                {draft.media && (
                  <img
                    className="preview-image"
                    src={draft.media}
                    alt="Draft"
                  />
                )}

                <div className="published-platforms">
                  {draft.platforms.map((platform) => (
                    <span key={platform}>
                      {platformData[platform].emoji} {platform}
                    </span>
                  ))}
                </div>

                <button
                  className="publish-button"
                  onClick={() =>
                    dispatch(publishDraft(draft.id))
                  }
                >
                  🚀 Publish Draft
                </button>

                <button
                  className="delete-post-button"
                  onClick={() =>
                    dispatch(deleteDraft(draft.id))
                  }
                >
                  🗑 Delete Draft
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* PUBLISHED POSTS */}
      {publishedPosts.length > 0 && (
        <section className="published-section">
          <h2>✨ Published Posts ✨</h2>

          <div className="published-grid">
            {publishedPosts.map((item) => (
              <article
                className="published-post"
                key={item.id}
              >
                <div className="published-header">
                  <span className="avatar">🌸</span>
                  <strong>You ✨</strong>
                </div>

                <p>{item.content}</p>

                {item.media && (
                  <div>
                    <img
                      className="preview-image"
                      src={item.media}
                      alt="Published"
                    />

                    <button
                      className="delete-image-button"
                      onClick={() =>
                        deletePublishedImage(item.id)
                      }
                    >
                      📸 Delete Image
                    </button>
                  </div>
                )}

                <div className="published-platforms">
                  {item.platforms.map((platform) => (
                    <span key={platform}>
                      {platformData[platform].emoji}{" "}
                      {platform}
                    </span>
                  ))}
                </div>

                <button
                  className="delete-post-button"
                  onClick={() =>
                    deletePublishedPost(item.id)
                  }
                >
                  🗑 Delete Post
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;