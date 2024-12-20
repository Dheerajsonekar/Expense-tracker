const expense = require("../models/Expense");
const User = require("../models/User");
const sequelize = require("sequelize");

// expense post api
exports.expensePost = async (req, res) => {
  const { amount, description, category } = req.body;
  const t = await sequelize.transaction();

  try {
    const response = await expense.create({
      amount,
      description,
      category,
      userId: req.user.id,
    }, {transaction: t});
    if (response) {
      // Update the totalAmount in the User table
      await User.increment("totalAmount", {
        by: parseFloat(amount),
        where: { id: req.user.id },
        transaction: t
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

// show expense api
exports.showExpenses = async (req, res) => {
  try {
    const response = await expense.findAll({
      where: { userId: req.user.id },
      orders: [["createdAt", "DESC"]],
    });
    if (response) {
      return res.status(200).json(response);
    }
  } catch (err) {
    console.error("failed to showExpenses");
    return res.status(500).json({ message: "failed to show expenses." });
  }
};

// delete expense api
exports.deleteExpense = async (req, res) => {
  const expenseId = req.params.id;

  try {
    const response = await expense.destroy({
      where: { id: expenseId, userId: req.user.id },
    });
    if (response) {
      return res.status(200).json({ message: "Expense deleted sucessfully" });
    } else {
      return res
        .status(404)
        .json({ message: "Expense not found || or unauthorized action!" });
    }
  } catch (err) {
    console.error("deleteExpense api Error: failed to delete ", err);
    res.status().json({ message: "" });
  }
};

// premium feature leaderboard
exports.getboard = async (req, res) => {
  try {
    const response = await User.findAll({
      where: { isPremium: true },
      attributes: ['name', 'totalAmount'], // Include user name and totalAmount
      order: [['totalAmount', 'DESC']], // Order by totalAmount
    });

    // Format the leaderboard response
    const leaderboard = response.map((user) => ({
      username: user.name, // User's name
      totalAmount: user.totalAmount || 0, // Total amount
    }));

    console.log('Formatted Leaderboard Data:', leaderboard);
    return res.status(200).json(leaderboard);
  } catch (err) {
    console.error('Error in getboard API:', err.message, err);
    return res.status(500).json({ message: 'Failed to fetch leaderboard data.', error: err.message });
  }
};
