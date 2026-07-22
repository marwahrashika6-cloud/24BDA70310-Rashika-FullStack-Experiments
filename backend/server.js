const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✨ PostPop Backend is running! ✨");
});

// Receive a post from the frontend
app.post("/api/posts", (req, res) => {
  const { content, platforms } = req.body;

  console.log("New post received:");
  console.log("Content:", content);
  console.log("Platforms:", platforms);

  res.status(201).json({
    success: true,
    message: "✨ Your magic was published successfully!",
    post: {
      content,
      platforms,
    },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});