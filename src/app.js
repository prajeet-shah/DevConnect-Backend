const express = require("express");
const connectDB = require("./config/database");

const User = require("./models/user");
const user = require("./models/user");
const app = express();

app.use(express.json()); // it takes the JSON from the request body and convert it into JS objects

app.post("/signup", async (req, res) => {
  // creating a new instance of user model
  console.log(req.body);

  const user = new User(req.body);
  // const user = new User({
  //   firstName: "MS",
  //   lastName: "Dhoni",
  //   emailId: "dhoni@gmail.com",
  //   password: "dhoni@123",
  // });

  try {
    await user.save();
    res.send("user Added Successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

// get user by email

app.get("/user", async (req, res) => {
  const email = req.body.emailId;
  // finding for user having email
  const users = await User.find({ emailId: email });

  // finding the user with email id but only one
  // const users = await User.findOne({ emailId: email });

  try {
    if (users.length === 0) {
      res.send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// get feed api - get all the data from the database

app.get("/feed", async (req, res) => {
  const users = await User.find({});
  try {
    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// delete a user from the database

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    await User.findByIdAndDelete(userId); // we can use any of these
    // await User.findByIdAndDelete({ _id: userId });

    res.send("user deleted successfully!");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// update the user into the database using userId

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdatedAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdatedAllowed) {
      throw new Error("Update not allowed");
    }

    if (data.skills.length > 10) {
      throw new Error("more than 10 skills can not be allowed");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });

    res.send("user updated successfully!" + user);
    console.log(user);
  } catch (err) {
    res.status(400).send("something went wrong " + err.message);
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
