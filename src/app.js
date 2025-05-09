const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const http = require("http");
const initializeServer = require("./utils/socket");
const chatRouter = require("./routes/chat");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json()); // it takes the JSON from the request body and convert it into JS objects
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeServer(server);

connectDB()
  .then(() => {
    console.log("Database Connection Established....");
    server.listen(7777, () => {
      console.log("server running on the port 7777");
    });
  })
  .catch((err) => console.log("Database not connected successfully!"));
