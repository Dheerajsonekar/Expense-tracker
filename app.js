const express = require("express");
require("dotenv").config();
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = process.env.PORT || 3000;
const userRoutes = require("./routes/userRoutes");
const sequelize = require("./util/database");
const User = require("./models/User");
const Expense = require("./models/Expense");
const Payment = require("./models/Payment");
const forgotPasswordRequests = require("./models/forgotPasswordRequests");
const DownloadedFile = require("./models/downloadedFiles");
const helmet = require("helmet");

const morgan = require("morgan");

const accessLog = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flag: "a",
});

app.use(helmet());

app.use(morgan("combined", { stream: accessLog }));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.get("/password/resetPassword/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "resetPassword.html"));
});
app.use("/api", userRoutes);

User.hasMany(Expense, { foreignKey: "userId", onDelete: "CASCADE" });
Expense.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Payment, { foreignKey: "userId", onDelete: "CASCADE" });
Payment.belongsTo(User, { foreignKey: "userId" });

User.hasMany(forgotPasswordRequests, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
forgotPasswordRequests.belongsTo(User, { foreignkey: "userId" });

User.hasMany(DownloadedFile, { foreignKey: "userId", onDelete: "CASCADE" });
DownloadedFile.belongsTo(User, { foreignKey: "userId" });

sequelize
  // .sync({alter: true})
  .sync()
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Server is running on the Port ${PORT}.`);
    });
  })
  .catch((err) => console.error(err));
