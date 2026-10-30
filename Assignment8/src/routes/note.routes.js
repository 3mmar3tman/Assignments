const express = require("express");
const router = express.Router();

const {
  createNote,
  updateNote,
  replaceNote,
  updateAllNotesTitles,
  deleteNote,
  paginateSortNotes,
  getNoteById,
  getNoteByContent,
  getNotesWithUser,
  aggregateNotes,
  deleteAllNotes,
} = require("../controllers/note.controller");

// Create a note
router.post("/", createNote);

// Update the title of all notes
router.patch("/all", updateAllNotesTitles);

// Pagination and sorting
router.get("/paginate-sort", paginateSortNotes);

// Find a note by content
router.get("/note-by-content", getNoteByContent);

// Get notes with user information
router.get("/note-with-user", getNotesWithUser);

// Aggregation
router.get("/aggregate", aggregateNotes);

// Replace a complete note
router.put("/replace/:noteId", replaceNote);

// Update one note
router.patch("/:noteId", updateNote);

// Delete one note
router.delete("/:noteId", deleteNote);

// Get one note by ID
router.get("/:id", getNoteById);

// Delete all notes belonging to a user
router.delete("/", deleteAllNotes);

module.exports = router;