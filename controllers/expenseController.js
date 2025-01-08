const expense = require("../models/Expense");
const User = require("../models/User");
const DownloadedFile = require("../models/downloadedFiles");
const sequelize = require("sequelize");
const Sequelize = require("../util/database");
const S3Service = require("../services/s3Service");

// Download expenses

exports.getDownloadedFiles = async (req, res) => {
  try {
    const files = await DownloadedFile.findAll({
      where: { userId: req.user.id },
      attributes: ["fileName", "fileUrl", "downloadedAt"],
      order: [["downloadedAt", "DESC"]],
    });

    return res.status(200).json({ success: true, files });
  } catch (err) {
    console.error("Failed to fetch downloaded files:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch files." });
  }
};

exports.downloadExpenses = async (req, res) => {
  const expenses = await expense.findAll({
    where: { userId: req.user.id },
  });
  const stringiFiedExpense = JSON.stringify(expenses);

  const userId = req.user.id;
  const fileName = `Expense${userId}/${new Date()}.txt`;

  try {
    const fileUrl = await S3Service.uploadToS3(stringiFiedExpense, fileName);

    if (!fileUrl) {
      throw new Error("File URL generation failed.");
    }

    await DownloadedFile.create({
      userId,
      fileName,
      fileUrl,
    });

    res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    console.error("failed to download at api", err);
    return res.status(500).json({ fileUrl: "", success: false, err: err });
  }
};

// expense post api
exports.expensePost = async (req, res) => {
  const { amount, description, category } = req.body;
  const t = await Sequelize.transaction();

  try {
    const response = await expense.create(
      {
        amount,
        description,
        category,
        userId: req.user.id,
      },
      { transaction: t }
    );
    if (response) {
      // Update the totalAmount in the User table
      await User.increment("totalAmount", {
        by: parseFloat(amount),
        where: { id: req.user.id },
        transaction: t,
      });

      await t.commit();
      return res.status(201).json({ message: "expense posted successfully!" });
    }
  } catch (err) {
    await t.rollback();
    console.error("failed to post expense", err);
    return res.status(500).json(err);
  }
};

// show expense api with pagination
exports.showExpenses = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default values if not provided
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await expense.findAndCountAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      offset: parseInt(offset), // Skip previous records
      limit: parseInt(limit), // Limit the number of records
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      currentPage: parseInt(page),
      totalPages,
      totalExpenses: count,
      expenses: rows,
    });
  } catch (err) {
    console.error("failed to showExpenses", err);
    return res.status(500).json({ message: "failed to show expenses." });
  }
};

// delete expense api
exports.deleteExpense = async (req, res) => {
  const expenseId = req.params.id;
  const t = await Sequelize.transaction();

  try {
    // Find the expense to get the amount
    const expenseToDelete = await expense.findOne({
      where: { id: expenseId, userId: req.user.id },
      transaction: t,
    });

    if (!expenseToDelete) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Expense not found || or unauthorized action!" });
    }

    const amount = expenseToDelete.amount;

    // Delete the expense
    const response = await expense.destroy({
      where: { id: expenseId, userId: req.user.id },
      transaction: t,
    });

    if (response) {
      // Decrement the totalAmount in the User table
      await User.increment("totalAmount", {
        by: -parseFloat(amount),
        where: { id: req.user.id },
        transaction: t,
      });

      await t.commit();
      return res.status(200).json({ message: "Expense deleted successfully" });
    } else {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Expense not found || or unauthorized action!" });
    }
  } catch (err) {
    await t.rollback();
    console.error("deleteExpense api Error: failed to delete ", err);
    return res.status(500).json({ message: "Failed to delete expense." });
  }
};

// premium feature leaderboard
exports.getboard = async (req, res) => {
  try {
    const response = await User.findAll({
      where: { isPremium: true },
      attributes: ["name", "totalAmount"],
      order: [["totalAmount", "DESC"]],
    });

    const leaderboard = response.map((user) => ({
      username: user.name, // User's name
      totalAmount: user.totalAmount || 0, // Total amount
    }));

    console.log("Formatted Leaderboard Data:", leaderboard);
    return res.status(200).json(leaderboard);
  } catch (err) {
    console.error("Error in getboard API:", err.message, err);
    return res.status(500).json({
      message: "Failed to fetch leaderboard data.",
      error: err.message,
    });
  }
};
