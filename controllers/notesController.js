const notes = require("../models/notes");
const User = require("../models/User");
const Sequelize = require("../util/database");

// add notes
exports.addNotes = async (req, res) => {
  const { note } = req.body;
  const t = await Sequelize.transaction();

  try {
    const response = await notes.create(
      {
        note,
        userId: req.user.id,
      },
      { transaction: t }
    );
    if (response) {
      await t.commit();
      return res.status(201).json({ message: "notes added successfully!" });
    }
  } catch (err) {
    await t.rollback();
    console.error("failed to add notes", err);
    return res.status(500).json(err);
  }
};

// show notes
exports.getnotes = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default values if not provided
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await notes.findAndCountAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      offset: parseInt(offset), // Skip previous records
      limit: parseInt(limit), // Limit the number of records
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      currentPage: parseInt(page),
      totalPages,
      totalNotes: count,
      note: rows,
    });
  } catch (err) {
    console.error("failed to showNotes", err);
    return res.status(500).json({ message: "failed to show Notes." });
  }
};


// delete notes
exports.deleteNotes = async (req, res) => {
  const noteId = req.params.id;
  console.log("noteId in api: ", noteId);
  const t = await Sequelize.transaction();

  try {
    // Find the expense to get the amount
    const noteToDelete = await notes.findOne({
      where: { id: noteId, userId: req.user.id },
      transaction: t,
    });

    if (!noteToDelete) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "note not found || or unauthorized action!" });
    }

    // Delete the expense
    const response = await notes.destroy({
      where: { id: noteId, userId: req.user.id },
      transaction: t,
    });

    if (response) {
      await t.commit();
      return res.status(200).json({ message: "Note deleted successfully" });
    } else {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Note not found || or unauthorized action!" });
    }
  } catch (err) {
    await t.rollback();
    console.error("deleteNote api Error: failed to delete ", err);
    return res.status(500).json({ message: "Failed to delete Note." });
  }
};
