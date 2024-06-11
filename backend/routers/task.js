const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");
const authenticateToken = require("../middlewares/authenticateToken");

router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { text, image } = req.body;
    const task = new Task({ text, image, userId: req.user.userId });
    await task.save();

    let user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.tasks) {
      user.tasks = [];
    }

    user.tasks.push(task._id);
    await user.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/list", authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const tasks = await Task.find({ userId: req.user.userId })
      .limit(limit)
      .skip(startIndex);

    const totalDocuments = await Task.countDocuments({
      userId: req.user.userId,
    });

    const results = {
      results: tasks,
      next: endIndex < totalDocuments ? { page: page + 1, limit: limit } : null,
      previous: startIndex > 0 ? { page: page - 1, limit: limit } : null,
    };

    res.status(200).json({
      results,
      page,
      limit,
      totalDocuments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Tek bir görevi güncelleme
router.put("/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, image } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { text, image },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.delete("/delete/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    const task = await Task.findOneAndDelete({ _id: id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await User.findByIdAndUpdate(req.user.userId, { $pull: { tasks: id } });

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
