const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const commonRouter = require("./routes/common");
app.use("/common", commonRouter);

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const socketPort = process.env.SOCKET_PORT || 3001;
const { Server } = require("socket.io");
const {
  TOKEN_OR_REFRESH_EMPTY,
  TOKEN_EXPIRED,
  TOKEN_INVALID,
  OTHER,
} = require("./modules/Error");
const { checkTokenSocket } = require("./middlewares/auth");
const jwt = require("jsonwebtoken");
const io = new Server(socketPort);

io.use(async (socket, next) => {
  try {
    await checkTokenSocket(socket.request);

    next();
  } catch (err) {
    const { code } = err;
    let errorObject = OTHER;

    switch (code) {
      case TOKEN_OR_REFRESH_EMPTY.code:
        errorObject = TOKEN_OR_REFRESH_EMPTY;
        break;
      case TOKEN_EXPIRED.code:
        errorObject = TOKEN_EXPIRED;
        break;
      case TOKEN_INVALID.code:
        errorObject = TOKEN_INVALID;
        break;
    }

    console.log(errorObject.message);
    next(err);
  }
});

io.use((socket, next) => {
  try {
    const token = socket.request.headers.authorization.replace("Bearer ", "");

    socket.userId = jwt.decode(token).id;
    next();
  } catch (err) {
    next(err);
  }
});

const chatHandler = require("./routes/handler/chatHandler");
io.on("connection", async (socket) => {
  console.log(`CONNECTION SOCKET ON ${socket.userId}`);
  socket.emit("init", await chatHandler.getChatLogs());

  socket.on("message", async (message) => {
    const newMessage = await chatHandler.getChatLog(socket.userId, message);

    await newMessage.save();

    io.emit("message", newMessage);
  });
});

module.exports = app;
