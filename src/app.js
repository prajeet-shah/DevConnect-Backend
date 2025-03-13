const express = require("express");
const { AdminLogin, AuthUser } = require("./middlewares/Auth");
const app = express();

app.use("/admin", AdminLogin);

app.use("/user/login", (req, res, next) => {
  console.log("login yourself");
  // res.send("login yourself");

  throw new Error("ssdfjlis");
});

// handling error, normally use at the last of code handle error that won't be handle by try
// and catch
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});

app.use("/user", AuthUser);

app.use("/user/data", (req, res) => {
  res.send("All the data here!!");
});

app.use("/admin/getAllData", (req, res) => {
  res.send("all the data sent");
});

app.use("/admin/deleteData", (req, res) => {
  res.send("Deleted Successfully");
});

app.listen(7777, () => {
  console.log("server running on the port 7777");
});
