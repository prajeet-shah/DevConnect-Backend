const express = require("express");
const { AuthUser } = require("../middlewares/Auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();

// get all the pending connections from the database
userRouter.get("/user/request", AuthUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const data = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName  photoUrl gender skills"); // you can use string and field of array also like ["firsName", "lastName"]

    res
      .status(200)
      .json([
        { message: "connection Request fetched Successfully!!" },
        { data: data },
      ]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
