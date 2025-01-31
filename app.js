const express = require("express");
require("dotenv").config();
const app = express();
const https = require("https");
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
const Notes = require("./models/notes");

const morgan = require("morgan");


const serverKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");

const accessLog = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flag: "a",
});

app.use((req, res, next) => {
  res.removeHeader("Content-Security-Policy-Report-Only"); // Explicitly remove it
  next();
});

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; " +
    "style-src-elem 'self' https://fonts.googleapis.com 'unsafe-inline'; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "script-src 'self' 'unsafe-inline' https://api.razorpay.com; " +
    "frame-src 'self' https://api.razorpay.com; " +
    "img-src 'self' data:; " + 
    "connect-src 'self' https://api.razorpay.com;"
  );
  next();
});


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

User.hasMany(Notes, { foreignKey: "userId", onDelete: "CASCADE" });
Notes.belongsTo(User, { foreignKey: "userId" });

sequelize
  // .sync({alter: true})
  .sync()
  .then((result) => {
    https.createServer({key: serverKey, cert:certificate}, app).listen(PORT, () => {
      console.log(`Server is running on the Port ${PORT}.`);
    });
  })
  .catch((err) => console.error(err));
