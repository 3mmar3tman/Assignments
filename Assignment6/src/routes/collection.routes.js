const router = require("express").Router();
const controller = require("../controllers/collection.controller");

router.post("/books", controller.createBooksCollection);
router.post("/authors", controller.createAuthorsCollection);
router.post("/logs/capped", controller.createCappedLogsCollection);
router.post("/books/index", controller.createBooksTitleIndex);

module.exports = router;
