const router = require("express").Router();
const controller = require("../controllers/book.controller");

router.post("/batch", controller.insertManyBooks);
router.patch("/Future", controller.updateFutureBook);
router.get("/title", controller.findBookByTitle);
router.get("/year", controller.findBooksByYearRange);
router.get("/genre", controller.findBooksByGenre);
router.get("/skip-limit", controller.skipLimitSort);
router.get("/year-integer", controller.findBooksWithIntegerYear);
router.get("/exclude-genres", controller.excludeGenres);
router.delete("/before-year", controller.deleteBooksBeforeYear);
router.get("/aggregate1", controller.aggregate1);
router.get("/aggregate2", controller.aggregate2);
router.get("/aggregate3", controller.aggregate3);
router.get("/aggregate4", controller.aggregate4);
router.post("/", controller.insertOneBook);

module.exports = router;
