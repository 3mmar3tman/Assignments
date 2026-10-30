const mongoose = require("mongoose");
const db = () => mongoose.connection.db;

exports.createBooksCollection = async (req, res, next) => {
  try {
    const existing = await db().listCollections({ name: "books" }).hasNext();
    if (existing) return res.status(200).json({ message: "books collection already exists; validation was not changed" });
    await db().createCollection("books", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title"],
          properties: {
            title: { bsonType: "string", minLength: 1, pattern: ".*\\S.*" }
          }
        }
      },
      validationLevel: "strict",
      validationAction: "error"
    });
    res.status(201).json({ message: "books collection created with non-empty title validation" });
  } catch (e) { next(e); }
};

exports.createAuthorsCollection = async (req, res, next) => {
  try {
    const author = req.body && Object.keys(req.body).length ? req.body : { name: "George Orwell", country: "United Kingdom" };
    const result = await db().collection("authors").insertOne(author);
    res.status(201).json({ message: "authors collection created implicitly by insert", insertedId: result.insertedId });
  } catch (e) { next(e); }
};

exports.createCappedLogsCollection = async (req, res, next) => {
  try {
    const exists = await db().listCollections({ name: "logs" }).hasNext();
    if (exists) return res.status(200).json({ message: "logs collection already exists; it was not recreated" });
    await db().createCollection("logs", { capped: true, size: 1048576 });
    res.status(201).json({ message: "Capped logs collection created", sizeBytes: 1048576 });
  } catch (e) { next(e); }
};

exports.createBooksTitleIndex = async (req, res, next) => {
  try {
    const name = await db().collection("books").createIndex({ title: 1 });
    res.json({ message: "Index created", indexName: name });
  } catch (e) { next(e); }
};
