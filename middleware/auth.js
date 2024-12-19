const jwt = require("jsonwebtoken");
const User = require("../models/User");

// jwt authentication
exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  console.log("token taken by middleware", token);
  if (!token) {
    return res.status(401).json({ message: "Authentication failed!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "user not found!" });
    }

    req.user = {
      id: user.id,
      isPremium: user.isPremium
    };

    next();
  } catch (err) {
    console.error("failed to authenticate", err);
    return res.status(401).json({ message: "invalid token!" });
  }
};
