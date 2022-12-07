const User = require("../schema/User");
const jwt = require("jsonwebtoken");
const {
  secretKey,
  options,
  refreshTokenOptions,
} = require("./config/jwtOptions");
const ERROR = require("../modules/Error");

module.exports = {
  sign: async (user) => {
    const payload = { id: user.id };

    return jwt.sign(payload, secretKey, options);
  },
  verify: async (token) => {
    let decoded;

    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      const { message } = error;
      const { OTHER, TOKEN_EXPIRED, TOKEN_INVALID } = ERROR;

      let errorCode = OTHER.code;
      let errorMessage = OTHER.message;
      if (message === "jwt expired") {
        errorCode = TOKEN_EXPIRED.code;
        errorMessage = TOKEN_EXPIRED.message;
      } else if (message === "invalid token") {
        errorCode = TOKEN_INVALID.code;
        errorMessage = TOKEN_INVALID.message;
      }

      console.log(`jwt module Error: ${errorMessage}`);
      return errorCode;
    }

    return decoded;
  },
  refresh: (_) => {
    return jwt.sign({}, secretKey, refreshTokenOptions);
  },
  refreshVerify: async (refreshToken, id) => {
    try {
      const user = await User.findOne({ id });

      if (refreshToken === user.refreshToken) {
        jwt.verify(refreshToken, secretKey);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  isExpired: (token) => {
    if (!token) return true;

    try {
      jwt.verify(token, secretKey);
    } catch (error) {
      if (error.message === "jwt expired") return true;
    }

    return false;
  },
};
