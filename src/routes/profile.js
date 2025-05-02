const express = require("express");
const { AuthUser } = require("../middlewares/Auth");
const User = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");


const profileRouter = express.Router();

profileRouter.get("/profile/view", AuthUser, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("user not found");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", AuthUser, async (req, res) => {
  try {
    const { emailId, ...UpdateDetails } = req.body;
    if (emailId) {
      throw new Error("Not allowed to change EmailId , firstName and lastName");
    }

    const updatedProfile = req.user;

    // user = req.user;
    // const updatedProfile = await User.findByIdAndUpdate(
    //   user._id,
    //   UpdateDetails,
    //   { new: true }
    // );

    Object.keys(UpdateDetails).forEach((key) => {
      updatedProfile[key] = UpdateDetails[key];
    });

    updatedProfile.save();
    if (!updatedProfile) {
      throw new Error("something went wrong");
    }

    res.json({
      message: ` ${
        updatedProfile.firstName + updatedProfile.lastName
      } profile updated successfully`,
      data: updatedProfile,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/password", AuthUser, async (req, res) => {
  // enter the previous password
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.json({ message: "enter the new and old password" });
    }

    const user = req.user;

    const IsOlderPasswordVerify = await bcrypt.compare(
      oldPassword,
      user.password
    );
    if (!IsOlderPasswordVerify) {
      return res.json({ message: "please enter the correct old password" });
    }

    const IspasswordValidate = validator.isStrongPassword(newPassword);
    if (!IspasswordValidate) {
      throw new Error("please enter the strong password");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(
      user._id,
      { password: passwordHash },
      { new: true }
    );
    res.json({ message: "password updated successfully" });
  } catch (err) {
    res.status(400).json({ error: `ERROR : ${err.message}` });
  }
});

module.exports = profileRouter;
