const express = require("express");

const app = express();

app.use("/user", [
  (req, res, next) => {
    console.log("response 1");
    // res.send("hello world");
    next();
  },
  (req, res, next) => {
    console.log("response 2");
    res.send("hello world 2");
  },
  (req, res, next) => {
    console.log("response 3");
    res.send("hello world 3");
    next();
  },
  (req, res, next) => {
    console.log("response 4");
    res.send("hello world 4");
    next();
  },
]);

app.listen(7777, () => {
  console.log("server running on the port 7777");
});
