const mongoose = require("mongoose");
const Note = require("../models/note.model");

// 1. Create a single note
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.query.userId;

    const note = await Note.create({
      title,
      content,
      userId,
    });

    return res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// 2. Update a single note
exports.updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.query.userId;

    const updates = {};

    if (req.body.title !== undefined) {
      updates.title = req.body.title;
    }

    if (req.body.content !== undefined) {
      updates.content = req.body.content;
    }

    const note = await Note.findOneAndUpdate(
      {
        _id: noteId,
        userId,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found or you are not its owner",
      });
    }

    return res.status(200).json({
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    if (
      error.name === "CastError" ||
      error.name === "ValidationError"
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// 3. Replace an entire note
exports.replaceNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.query.userId;
    const { title, content } = req.body;

    if (title === undefined || content === undefined) {
      return res.status(400).json({
        message: "Title and content are required for replacement",
      });
    }

    const note = await Note.findOneAndReplace(
      {
        _id: noteId,
        userId,
      },
      {
        title,
        content,
        userId,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found or you are not its owner",
      });
    }

    return res.status(200).json({
      message: "Note replaced successfully",
      note,
    });
  } catch (error) {
    if (
      error.name === "CastError" ||
      error.name === "ValidationError"
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// 4. Update the title of all notes belonging to a user
exports.updateAllNotesTitles = async (req, res) => {
  try {
    const userId = req.query.userId;
    const { title } = req.body;

    if (title === undefined) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const result = await Note.updateMany(
      { userId },
      { $set: { title } },
      { runValidators: true }
    );

    return res.status(200).json({
      message: "Notes updated successfully",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    if (
      error.name === "CastError" ||
      error.name === "ValidationError"
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// 5. Delete a single note and return the deleted note
exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.query.userId;

    const note = await Note.findOneAndDelete({
      _id: noteId,
      userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found or you are not its owner",
      });
    }

    return res.status(200).json({
      message: "Note deleted successfully",
      note,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ID",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// 6. Paginate and sort notes by createdAt descending
exports.paginateSortNotes = async (req, res) => {
  try {
    const userId = req.query.userId;

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100
    );

    const skip = (page - 1) * limit;

    const [notes, totalNotes] = await Promise.all([
      Note.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Note.countDocuments({ userId }),
    ]);

    return res.status(200).json({
      page,
      limit,
      totalNotes,
      totalPages: Math.ceil(totalNotes / limit),
      notes,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// 7. Get a single note by ID
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;

    const note = await Note.findOne({
      _id: id,
      userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found or you are not its owner",
      });
    }

    return res.status(200).json({
      note,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ID",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// 8. Find a note by content
exports.getNoteByContent = async (req, res) => {
  try {
    const userId = req.query.userId;
    const { content } = req.query;

    if (content === undefined) {
      return res.status(400).json({
        message: "Content query parameter is required",
      });
    }

    const notes = await Note.find({
      userId,
      content,
    });

    return res.status(200).json({
      count: notes.length,
      notes,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// 9. Get notes with selected fields and user email
exports.getNotesWithUser = async (req, res) => {
  try {
    const userId = req.query.userId;

    const notes = await Note.find({ userId })
      .select("title userId createdAt")
      .populate({
        path: "userId",
        select: "email",
      });

    return res.status(200).json({
      count: notes.length,
      notes,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// 10. Aggregate notes with user information and optional title search
exports.aggregateNotes = async (req, res) => {
  try {
    const userId = req.query.userId;
    const { title } = req.query;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const matchStage = {
      userId: new mongoose.Types.ObjectId(userId),
    };

    if (title !== undefined) {
      matchStage.title = title;
    }

    const notes = await Note.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          title: 1,
          content: 1,
          userId: 1,
          createdAt: 1,
          updatedAt: 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
    ]);

    return res.status(200).json({
      count: notes.length,
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// 11. Delete all notes belonging to a user
exports.deleteAllNotes = async (req, res) => {
  try {
    const userId = req.query.userId;

    const result = await Note.deleteMany({ userId });

    return res.status(200).json({
      message: "User notes deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};