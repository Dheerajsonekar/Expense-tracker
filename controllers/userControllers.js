const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// sign up api
exports.signupPost = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const alreadyExits = await User.findOne({ where: { email } });

    if (alreadyExits) {
      return res.status(400).json({ message: "Email already exits" });
    }

    // encrypt pass before storing with saltround=10
    const hashPassword = await bcrypt.hash(password, 10);
    const response = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashPassword,
    });

    if (response) {
      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (err) {
    console.error("Error during signUp", err);
    return res.status(500).json({ message: "Error occurs during signup." });
  }
};

// login api
exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  try {
    const emailExits = await User.findOne({ where: { email } });
    if (!emailExits) {
      return res.status(400).json({ message: "user doesn't exits." });
    }

    const isValidPassword = await bcrypt.compare(password, emailExits.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password! " });
    }

    //JWT Token genereted
    const token = jwt.sign(
      { id: emailExits.id, email: emailExits.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    console.log("token generated in loginapi", token);

    return res
      .status(200)
      .json({ message: "User logged in succesfully", token });
  } catch (err) {
    console.error("logged in failed", err);
    return res.status(500).json({ message: "Error in loggin" });
  }
};

// get user name for displaying in header

exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json({ username: user.name, premium: user.isPremium });
  } catch (err) {
    console.error("failed to get user in api", err);
    return res.status(500).json({ message: "failed to get username" });
  }
};
