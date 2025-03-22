const express = require("express");
const { AuthUser } = require("../middlewares/Auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  AuthUser,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // check the status and only allow interested and ignored status
      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "not valid status" });
      }

      // check if the touserid exist in the database

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        throw new Error("you cannot send the connection!!");
      }

      // check if the request send to yourself

      if (toUserId.toString() === fromUserId.toString()) {
        throw new Error("you can't send request to yourself");
      }

      // check if the connection request already exist or toUserId can't send request to fromUserId
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "connection Request already exists" });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res
        .status(200)
        .json([
          { message: req.user.firstName + status + toUser.firstName },
          { data: data },
        ]);
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  AuthUser,
  async (req, res) => {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    // check if the status is valid

    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "status is not valid!" });
    }

    const connectionRequest = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      throw new Error("cannot find the connectionRequest");
    }
    // loggedInUser = req.user -> toUserId
    // status = interested
    // check if the requestId is valid
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res
      .status(200)
      .json([
        { message: "request " + status + " successfully!!" },
        { data: data },
      ]);
    try {
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = requestRouter;
