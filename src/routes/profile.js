const express = require("express");
const { AuthUser } = require("../middlewares/Auth");
const User = require("../models/user");
const { validateProfileEditData } = require("../utils/validation");

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

    res.json({ message: "profile updated successfully", data: updatedProfile });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
