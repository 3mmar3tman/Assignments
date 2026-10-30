const express = require("express");
const router = express.Router();

const {
  createPost,
  deletePost,
  getPostDetails,
  getPostCommentCount,
} = require("../controllers/postController");

router.get("/details", getPostDetails);
router.get("/comment-count", getPostCommentCount);
router.post("/", createPost);
router.delete("/:postId", deletePost);

module.exports = router;