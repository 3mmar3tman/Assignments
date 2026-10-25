const mongoose = require("mongoose");
const books = () => mongoose.connection.db.collection("books");

exports.insertOneBook = async (req, res, next) => {
  try {
    const book = req.body;
    if (!book || typeof book.title !== "string" || !book.title.trim())
      return res.status(400).json({ message: "title is required and must be non-empty" });
    const result = await books().insertOne(book);
    res.status(201).json({ message: "Book inserted", insertedId: result.insertedId });
  } catch (e) { next(e); }
};

exports.insertManyBooks = async (req, res, next) => {
  try {
    const documents = req.body.books || req.body;
    if (!Array.isArray(documents) || documents.length < 3)
      return res.status(400).json({ message: "Send an array of at least three books (or { books: [...] })" });
    if (documents.some(b => !b.title || !String(b.title).trim()))
      return res.status(400).json({ message: "Every book must have a non-empty title" });
    const result = await books().insertMany(documents);
    res.status(201).json({ message: "Books inserted", insertedCount: result.insertedCount, insertedIds: result.insertedIds });
  } catch (e) { next(e); }
};

exports.updateFutureBook = async (req, res, next) => {
  try {
    const result = await books().updateOne({ title: "Future" }, { $set: { year: 2022 } });
    res.json({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount, message: result.matchedCount ? "Future book updated" : "No book titled Future found" });
  } catch (e) { next(e); }
};

exports.findBookByTitle = async (req, res, next) => {
  try {
    if (!req.query.title) return res.status(400).json({ message: "Provide ?title=Brave%20New%20World" });
    res.json(await books().find({ title: req.query.title }).toArray());
  } catch (e) { next(e); }
};

exports.findBooksByYearRange = async (req, res, next) => {
  try {
    const from = Number(req.query.from), to = Number(req.query.to);
    if (!Number.isFinite(from) || !Number.isFinite(to)) return res.status(400).json({ message: "Provide numeric from and to query parameters" });
    res.json(await books().find({ year: { $gte: from, $lte: to } }).toArray());
  } catch (e) { next(e); }
};

exports.findBooksByGenre = async (req, res, next) => {
  try {
    if (!req.query.genre) return res.status(400).json({ message: "Provide ?genre=Science%20Fiction" });
    res.json(await books().find({ genres: req.query.genre }).toArray());
  } catch (e) { next(e); }
};

exports.skipLimitSort = async (req, res, next) => {
  try { res.json(await books().find({}).sort({ year: -1 }).skip(2).limit(3).toArray()); }
  catch (e) { next(e); }
};

exports.findBooksWithIntegerYear = async (req, res, next) => {
  try { res.json(await books().find({ year: { $type: "int" } }).toArray()); }
  catch (e) { next(e); }
};

exports.excludeGenres = async (req, res, next) => {
  try {
    res.json(await books().find({ genres: { $nin: ["Horror", "Science Fiction"] } }).toArray());
  } catch (e) { next(e); }
};

exports.deleteBooksBeforeYear = async (req, res, next) => {
  try {
    const year = Number(req.query.year ?? 2000);
    if (!Number.isFinite(year)) return res.status(400).json({ message: "year must be numeric" });
    const result = await books().deleteMany({ year: { $lt: year } });
    res.json({ deletedCount: result.deletedCount });
  } catch (e) { next(e); }
};

exports.aggregate1 = async (req, res, next) => {
  try { res.json(await books().aggregate([{ $match: { year: { $gt: 2000 } } }, { $sort: { year: -1 } }]).toArray()); }
  catch (e) { next(e); }
};

exports.aggregate2 = async (req, res, next) => {
  try { res.json(await books().aggregate([
    { $match: { year: { $gt: 2000 } } },
    { $project: { _id: 0, title: 1, author: 1, year: 1 } }
  ]).toArray()); }
  catch (e) { next(e); }
};

exports.aggregate3 = async (req, res, next) => {
  try { res.json(await books().aggregate([
    { $unwind: "$genres" },
    { $project: { _id: 0, title: 1, author: 1, year: 1, genre: "$genres" } }
  ]).toArray()); }
  catch (e) { next(e); }
};

exports.aggregate4 = async (req, res, next) => {
  try { res.json(await books().aggregate([
    { $lookup: { from: "logs", localField: "title", foreignField: "bookTitle", as: "relatedLogs" } }
  ]).toArray()); }
  catch (e) { next(e); }
};
