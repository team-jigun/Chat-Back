const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const { EMPTY_INFO: { USER_ID, USER_PASSWORD, USERNAME }, WRONG_PASSWORD: { IN_KOREAN }, OTHER, EXISTS_ID, NOT_EXISTS_USER } = require('./modules/ERROR');
const util = require('./modules/util');
const User = require('./schema/User');

const encodePassword = require('./modules/crypto');
const { sign, refresh, isExpired } = require('./middlewares/jwt');
/**
   * 회원가입에 필요한 변수들.
   * 
   * 1. id
   * 2. password
   * 3. name
   * 
   * 
   * 기능 정의
   * 
   * 1. 필요한 변수 값을 받는다.
   * 2. 변수 데이터가 올바른지 확인한다.
   * 3. password를 암호화한다.
   * 4. User ID가 존재하는지 확인한다.
   * 5. 데이터를 DB에 저장한다.
   * 6. client에게 message를 던져준다.
*/
app.post('/signUp', async (req, res) => {
  // 1. 필요한 변수 값을 받는다.
  const { id, password, name } = req.body;

  try {
    // 2. 변수 데이터가 올바른지 확인한다.
    if (!id) {
      throw USER_ID;
    } else if (!password) {
      throw USER_PASSWORD;
    } else if (!name) {
      throw USERNAME;
    }

    // 3. password를 암호화한다.
    const encodedPassword = encodePassword(password);

    // 4. User ID가 존재하는지 확인한다.
    const isExistsUserId = await User.findOne({ id });
    if (isExistsUserId) throw EXISTS_ID;

    // 5. 데이터를 DB에 저장한다.
    await User.create({
      id, password: encodedPassword, name
    });

    // 6. client에게 message를 던져준다.
    return res.json(util.success('SUCCESS_SIGN_UP', 'Success sign up!'));
  } catch ({ code, message }) {
    switch(code) {
      case USER_ID.code:
        return res.json(util.fail(USER_ID.code, USER_ID.message));
      case USER_PASSWORD.code:
        return res.json(util.fail(USER_PASSWORD.code, USER_PASSWORD.message));
      case USERNAME.code:
        return res.json(util.fail(USERNAME.code, USERNAME.message));
      case IN_KOREAN.code:
        return res.json(util.fail(IN_KOREAN.code, IN_KOREAN.message));
      case EXISTS_ID.code:
        return res.json(util.fail(EXISTS_ID.code, EXISTS_ID.message));
      default:
        console.log(message);
        return res.json(util.fail(OTHER.code, OTHER.message));
    }
  }
});

/**
   * 로그인에 필요한 변수들.
   * 
   * 1. id
   * 2. password
   * 
   * 
   * 기능 정의
   * 
   * 1. 필요한 변수 값을 받는다.
   * 2. 변수 데이터가 올바른지 확인한다.
   * 3. password를 암호화한다.
   * 4. ID와 PASSWORD가 동일한 USER가 존재하는가 확인.
   * 5. client에게 message를 던져준다.
*/
app.post('/signIn', async (req, res) => {
  const { id, password } = req.body;

  try {
    // 2. 변수 데이터가 올바른지 확인한다.
    if (!id) {
      throw USER_ID;
    } else if (!password) {
      throw USER_PASSWORD;
    }

    // 3. password를 암호화한다.
    const encodedPassword = encodePassword(password);

    // 4. ID와 PASSWORD가 동일한 USER가 존재하는가 확인.
    const user = await User.findOne({ id, password: encodedPassword });
    if (!user) {
      throw NOT_EXISTS_USER;
    }

    const token = await sign(user);

    let { refreshToken } = user;
    if (isExpired(refreshToken)) {
      refreshToken = await refresh();
      await User.updateOne({ id: user.id }, {$set: { refreshToken }});
    }

    const options = {
      token, refreshToken
    };
    // 5. client에게 message를 던져준다.
    return res.json(util.success('SUCCESS_SIGN_IN', 'Success sign in!', options))
  } catch ({ code, message }) {
    switch(code) {
      case USER_ID.code:
        return res.json(util.fail(USER_ID.code, USER_ID.message));
      case USER_PASSWORD.code:
        return res.json(util.fail(USER_PASSWORD.code, USER_PASSWORD.message));
      case NOT_EXISTS_USER.code:
        return res.json(util.fail(NOT_EXISTS_USER.code, NOT_EXISTS_USER.message));
      case IN_KOREAN.code:
        return res.json(util.fail(IN_KOREAN.code, IN_KOREAN.message));
      case EXISTS_ID.code:
        return res.json(util.fail(EXISTS_ID.code, EXISTS_ID.message));
      default:
        console.log(message);
        return res.json(util.fail(OTHER.code, OTHER.message));
    }
  }
});

module.exports = app;