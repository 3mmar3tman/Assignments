const { Post, User, Comment } = require("../models");

exports.createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    if (!title || !content || !userId) {
      return res.status(400).json({
        message: "title, content and userId are required",
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = new Post({ title, content, userId });
    await post.save();

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (Number(post.userId) !== Number(userId)) {
      return res.status(403).json({
        message: "Only the post owner can delete it",
      });
    }

    await post.destroy();

    return res.status(200).json({
      message: "Post soft-deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getPostDetails = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ["id", "title"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
        {
          model: Comment,
          as: "comments",
          attributes: ["id", "content"],
        },
      ],
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getPostCommentCount = async (req, res) => {
  try {
    const { fn, col } = require("sequelize");

    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        [fn("COUNT", col("comments.id")), "commentCount"],
      ],
      include: [
        {
          model: Comment,
          as: "comments",
          attributes: [],
          required: false,
        },
      ],
      group: ["Post.id"],
      subQuery: false,
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};