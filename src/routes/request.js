const express = require("express");
const { AuthUser } = require("../middlewares/Auth");
const requestRouter = express.Router();

requestRouter.post("/connectionrequest", AuthUser, (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("something went wrong");
    }
    res.send(user.firstName + " sent the Connection request ");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = requestRouter;
