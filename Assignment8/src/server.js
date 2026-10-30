require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const userRoutes = require("./routes/user.routes");
const noteRoutes = require("./routes/note.routes");

const app = express();

app.use(express.json());
console.log("userRoutes:", userRoutes);
console.log("userRoutes type:", typeof userRoutes);
console.log("userRoutes.use:", typeof userRoutes.use);

console.log("noteRoutes:", noteRoutes);
console.log("noteRoutes type:", typeof noteRoutes);
console.log("noteRoutes.use:", typeof noteRoutes.use);

app.use("/users", userRoutes);
app.use("/notes", noteRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();