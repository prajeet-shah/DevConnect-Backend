const express = require("express");
const connectDB = require("./config/database");

const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Prajeet",
    lastName: "Shah",
    emailId: "prajeet@gmail.com",
    password: "Prajeet@123",
  });

  try {
    await user.save();
    res.send("user Added Successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database Connection Established....");
    app.listen(7777, () => {
      console.log("server running on the port 7777");
    });
  })
  .catch((err) => console.log("Database not connected successfully!"));
