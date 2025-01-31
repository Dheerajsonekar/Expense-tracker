const User = require("../models/User");
const forgotPasswordRequests = require("../models/forgotPasswordRequests");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");

// register user
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

// login 
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


// get user details
exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res
      .status(200)
      .json({ username: user.name, premium: user.isPremium, totalAmount:user.totalAmount });
  } catch (err) {
    console.error("failed to get user in api", err);
    return res.status(500).json({ message: "failed to get username" });
  }
};


// forgot password 
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log("received email", email);

  const client = Sib.ApiClient.instance;
  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.SMTP_KEY;
  const transEmailApi = new Sib.TransactionalEmailsApi();

  const sender = {
    email: "dheerajsonekar2@gmail.com",
  };

  const receiver = [
    {
      email: email,
    },
  ];

  try {
    const emailExits = await User.findOne({ where: { email } });
    const requestId = uuidv4();
    if (emailExits) {
      const response = await transEmailApi.sendTransacEmail({
        sender,
        to: receiver,
        subject: "Reset password",
        textContent: `Click on the link to reset password http://localhost:3000/password/resetPassword/${requestId}`,
      });
      console.log("email response sent");

      await forgotPasswordRequests.create({
        id: requestId,
        userId: emailExits.id,
        isActive: true,
      });

      return res.status(200).json(response);
    } else {
      return res.status(404).json({ message: "email not Register with us!" });
    }
  } catch (err) {
    console.error("failed to send email at api", err);
    res.status(500).json({ message: "failed to send email api " });
  }
};


// reset password 
exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const requestId = req.params.id;

  try {
    const request = await forgotPasswordRequests.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ message: "invalid request" });
    }
    if (!request.isActive) {
      return res
        .status(400)
        .json({ message: "link expired. try again for another link!" });
    }

    const user = await User.findByPk(request.userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();
    request.isActive = false;
    await request.save();
    return res.status(200).json({ message: "password reset successfully" });
  } catch (err) {
    console.error("failed to reset password ", err);
    return res.status(500).json({ message: "failed to reset password" });
  }
};
