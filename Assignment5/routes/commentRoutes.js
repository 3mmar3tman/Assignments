const express = require("express");
const router = express.Router();

const {
  createBulkComments,
  updateComment,
  findOrCreateComment,
  searchComments,
  getNewestComments,
  getCommentDetails,
} = require("../controllers/commentController");

router.post("/find-or-create", findOrCreateComment);
router.get("/search", searchComments);
router.get("/newest/:postId", getNewestComments);
router.get("/details/:id", getCommentDetails);
router.post("/", createBulkComments);
router.patch("/:commentId", updateComment);

module.exports = router;