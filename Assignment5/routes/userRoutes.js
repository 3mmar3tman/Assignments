const express = require("express");
const router = express.Router();

const {
  signup,
  putUser,
  getUserByEmail,
  getUserById,
} = require("../controllers/userController");

router.post("/signup", signup);
router.put("/:id", putUser);
router.get("/by-email", getUserByEmail);
router.get("/:id", getUserById);

module.exports = router;