const express = require("express");
const { AuthUser } = require("../middlewares/Auth");
const profileRouter = express.Router();

profileRouter.get("/profile", AuthUser, async (req, res) => {
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

module.exports = profileRouter;
