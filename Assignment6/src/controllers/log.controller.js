const mongoose = require("mongoose");
exports.insertLog = async (req, res, next) => {
  try {
    const log = req.body && Object.keys(req.body).length ? req.body : { message: "Sample log", level: "info", createdAt: new Date() };
    const result = await mongoose.connection.db.collection("logs").insertOne(log);
    res.status(201).json({ message: "Log inserted", insertedId: result.insertedId });
  } catch (e) { next(e); }
};
