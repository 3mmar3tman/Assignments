const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  updateUser,
  deleteUser,
  getUser,
} = require("../controllers/user.controller");

router.post("/signup", signup);
router.post("/login", login);
router.patch("/:id", updateUser);
router.delete("/", deleteUser);
router.get("/", getUser);

module.exports = router;