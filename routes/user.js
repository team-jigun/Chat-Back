const router = require("express").Router();
const util = require("../modules/Util");
const User = require("../schema/User");

const authUtil = require("../middlewares/auth").checkToken;

const {
  EMPTY_INFO: { USER_ID, USER_PASSWORD, USERNAME },
  WRONG_PASSWORD: { IN_KOREAN },
  EXISTS_ID,
  OTHER,
  NOT_EXISTS_USER,
} = require("../modules/Error");
const encodePassword = require("../modules/crypto");
const { sign, refresh, isExpired } = require("../middlewares/jwt");

router.post("/signUp", async (req, res) => {
  const { id, password, name } = req.body;

  try {
    if (!id) {
      throw USER_ID;
    } else if (!password) {
      throw USER_PASSWORD;
    } else if (!name) {
      throw USERNAME;
    }

    const encodedPassword = encodePassword(password);

    const isExistsUserId = await User.findOne({ id });
    if (isExistsUserId) throw EXISTS_ID;

    await User.create({ id, password: encodedPassword, name });

    return res.send(util.success("SUCCESS_SIGN_UP", "Success signed up!"));
  } catch ({ code, message }) {
    switch (code) {
      case USER_ID.code:
      case USER_PASSWORD.code:
      case USERNAME.code:
      case IN_KOREAN.code:
      case EXISTS_ID.code:
        return res.json(util.fail(code, message));
      default:
        console.log(message);
        return res.json(util.fail(OTHER.code, OTHER.message));
    }
  }
});

router.post("/signIn", async (req, res) => {
  const { id, password } = req.body;

  try {
    if (!id) {
      throw USER_ID;
    } else if (!password) {
      throw USER_PASSWORD;
    }

    const encodedPassword = encodePassword(password);

    const user = await User.findOne({ id, password: encodedPassword });
    if (!user) throw NOT_EXISTS_USER;

    const token = await sign(user);

    let { refreshToken } = user;
    if (isExpired(refreshToken)) {
      refreshToken = await refresh();
      await User.updateOne({ id: user.id }, { $set: { refreshToken } });
    }

    const options = {
      token,
      refreshToken,
    };

    return res.json(
      util.success("SUCCESS_SIGN_IN", "Success signed in", options)
    );
  } catch ({ code, message }) {
    switch (code) {
      case USER_ID.code:
      case USER_PASSWORD.code:
      case IN_KOREAN.code:
      case NOT_EXISTS_USER:
        return res.json(util.fail(code, message));
      default:
        console.log(message);
        return res.json(util.fail(OTHER.code, OTHER.message));
    }
  }
});

router.post("/changeUsername", authUtil, async (req, res) => {
  const { username } = req.body;

  await User.updateOne({ id: req.id }, { $set: { name: username } });

  return res.json(
    util.success("CHANGED_USERNAME", "Successfully Changed Username", {})
  );
});

module.exports = router;
