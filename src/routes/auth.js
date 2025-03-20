const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { password, emailId, firstName, lastName } = req.body;
  try {
    // validate the user data from the signup
    validateSignUpData(req);
    // creating a new instance of user model
    console.log(req.body);

    // hash the password

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("user Added Successfully!");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("user not found");
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      throw new Error("password is not correct");
    }

    // create a jwt token
    const token = await jwt.sign({ _id: user._id }, "Prajeet@gd734%", {
      expiresIn: "7d",
    });
    console.log(token);
    // wrap the jwt token inside the cookies and sent it to the user
    res.cookie("token", token);
    res.send("login successfully");
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  //   res.cookie("token", null, { expires: new Date(Date.now()) });
  //   res.send("logout successfully");
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("logout successfully");
});

module.exports = authRouter;
