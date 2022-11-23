const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const commonRouter = require('./routes/common');
app.use('/common', commonRouter);

const userRouter = require('./routes/user');
app.use('/user', userRouter);

const socketPort = process.env.SOCKET_PORT || 3001;
const { Server } = require('socket.io');
const { OTHER, TOKEN_OR_REFRESH_EMPTY, TOKEN_EXPIRED, TOKEN_INVALID } = require('./modules/ERROR');
const { checkTokenSocket } = require('./middlewares/auth');
const jwt = require('jsonwebtoken');
const io = new Server(socketPort);

io.use(async (socket, next) => {
  try {
    console.log('test1');
    await checkTokenSocket(socket.request);

    next();
  } catch (error) {
    const { code } = error;
    let errorObject = OTHER;

    if (code === TOKEN_OR_REFRESH_EMPTY.code) {
      errorObject = TOKEN_OR_REFRESH_EMPTY;
    } else if (code === TOKEN_EXPIRED.code) {
      errorObject = TOKEN_EXPIRED;
    } else if (code === TOKEN_INVALID.code) {
      errorObject = TOKEN_INVALID;
    }

    console.log(errorObject.message);
    next(error);
  }
});

io.use((socket, next) => {
  try {
    console.log('test2');
    const token = socket.request.headers.authorization.replace('Bearer ', '');

    socket.userId = jwt.decode(token).id;
    next();
  } catch (error) {
    next(error);
  }
})

io.on('connection', socket => {
  console.log(`connection! ${socket.userId}`);

  socket.on('message', message => {
    console.log(message);
    socket.emit('test', 'test');
  });
});

module.exports = app;