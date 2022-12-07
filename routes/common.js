const router = require("express").Router();
const util = require("../modules/Util");
const jwt = require("jsonwebtoken");
const {
  TOKEN_INVALID,
  TOKEN_EXPIRED,
  USER_INVALID,
  TOKEN_NOT_EXPIRED,
  TOKEN_OR_REFRESH_EMPTY,
} = require("../modules/Error");
const { refreshVerify, verify, sign } = require("../middlewares/jwt");

router.get("/refresh", async (req, res) => {
  if (req.headers.authorization && req.headers.refresh) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const refreshToken = req.headers.refresh;

    const tokenResult = await verify(token);

    const decoded = jwt.decode(token);
    if (!decoded) {
      const { code, message } = TOKEN_INVALID;
      return res.json(util.fail(code, message));
    }

    const refreshResult = await refreshVerify(refreshToken, decoded.id);
    if (tokenResult === TOKEN_EXPIRED.code) {
      if (!refreshResult) {
        return res.json(util.fail(USER_INVALID.code, USER_INVALID.message));
      } else {
        const newToken = await sign(decoded);

        return res.json(
          util.success(
            "SUCCESS_REFRESH_ACCESS_TOKEN",
            "Refreshed Access Token",
            { token: newToken, refreshToken }
          )
        );
      }
    } else {
      return res.json(
        util.fail(TOKEN_NOT_EXPIRED.code, TOKEN_NOT_EXPIRED.message)
      );
    }
  } else {
    return res.json(
      util.fail(TOKEN_OR_REFRESH_EMPTY.code, TOKEN_OR_REFRESH_EMPTY.message)
    );
  }
});

module.exports = router;
