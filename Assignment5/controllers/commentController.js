const { Op } = require("sequelize");
const { Comment, User, Post } = require("../models");

// 1. POST /comments
exports.createBulkComments = async (req, res) => {
  try {
    const comments = req.body;

    if (!Array.isArray(comments) || comments.length === 0) {
      return res.status(400).json({
        message: "Provide a non-empty array of comments",
      });
    }

    const createdComments = await Comment.bulkCreate(comments, {
      validate: true,
    });

    return res.status(201).json(createdComments);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// 2. PATCH /comments/:commentId
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    if (!userId || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        message: "userId and non-empty content are required",
      });
    }

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (Number(comment.userId) !== Number(userId)) {
      return res.status(403).json({
        message: "Only the comment owner can update it",
      });
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. POST /comments/find-or-create
exports.findOrCreateComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;

    if (!postId || !userId || !content) {
      return res.status(400).json({
        message: "postId, userId and content are required",
      });
    }

    const [comment, created] = await Comment.findOrCreate({
      where: { postId, userId, content },
      defaults: { postId, userId, content },
    });

    return res.status(created ? 201 : 200).json({
      created,
      comment,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 4. GET /comments/search?word=the
exports.searchComments = async (req, res) => {
  try {
    const { word } = req.query;

    if (!word || !word.trim()) {
      return res.status(400).json({
        message: "word query parameter is required",
      });
    }

    const where = {
      content: { [Op.like]: `%${word}%` },
    };

    const [comments, count] = await Promise.all([
      Comment.findAll({ where }),
      Comment.count({ where }),
    ]);

    return res.status(200).json({
      count,
      comments,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 5. GET /comments/newest/:postId
exports.getNewestComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      order: [["createdAt", "DESC"]],
      limit: 3,
    });

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 6. GET /comments/details/:id
exports.getCommentDetails = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
        {
          model: Post,
          as: "post",
          attributes: ["id", "title", "content"],
        },
      ],
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};