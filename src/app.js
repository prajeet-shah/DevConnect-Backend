const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express();

app.use(express.json()); // it takes the JSON from the request body and convert it into JS objects
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Database Connection Established....");
    app.listen(7777, () => {
      console.log("server running on the port 7777");
    });
  })
  .catch((err) => console.log("Database not connected successfully!"));
