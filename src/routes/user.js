const express = require("express");
const { AuthUser } = require("../middlewares/Auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const user = require("../models/user");

const userRouter = express.Router();

// get all the pending connections from the database
userRouter.get("/user/request/received", AuthUser, async (req, res) => {
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

// get all the connection of user from the database

userRouter.get("/user/connections", AuthUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const USER_SAFE_DATA = "firstName lastName photoUrl gender skills";
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    if (!connectionRequest) {
      throw new Error("data not available!!");
    }

    const data = connectionRequest.map((user) => {
      return user.fromUserId._id.toString() === loggedInUser._id.toString()
        ? user.toUserId
        : user.fromUserId;
    });

    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/feed", AuthUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const USER_SAFE_DATA = "firstName lastName photoUrl gender skills";
    // find all the connections
    const connnectionRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeeds = new Set();

    connnectionRequest.forEach((req) => {
      hideUserFromFeeds.add(req.fromUserId.toString());
      hideUserFromFeeds.add(req.toUserId.toString());
    });

    // console.log(hideUserFromFeeds);

    const users = await user
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUserFromFeeds) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
