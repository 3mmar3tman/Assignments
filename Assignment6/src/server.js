require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const collectionRoutes = require("./routes/collection.routes");
const bookRoutes = require("./routes/book.routes");
const logRoutes = require("./routes/log.routes");

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Assignment 7 API is running" }));
app.use("/collection", collectionRoutes);
app.use("/books", bookRoutes);
app.use("/logs", logRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`)))
  .catch(err => { console.error("Database connection failed:", err.message); process.exit(1); });
