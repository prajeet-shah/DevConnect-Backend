const express = require("express");

const app = express();

app.use("/userApi", (req, res) => {
  res.send("hello world from userAPIs");
});

app.use("/test", (req, res) => {
  res.send("hello world from test");
});

app.use((req, res) => {
  res.send("hello world");
});

app.listen(7777, () => {
  console.log("server running on the port 7777");
});
