const router = require("express").Router();
const controller = require("../controllers/log.controller");
router.post("/", controller.insertLog);
module.exports = router;
