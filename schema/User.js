const mongoose = require('mongoose');

/**
 * 채팅을 서비스에 사용할 유저는 어느 정보가 있어야할까요?
 * 
 * id
 * password
 * name
 */

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('User', userSchema);