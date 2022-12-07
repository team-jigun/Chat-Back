module.exports = {
  WRONG_PASSWORD: {
    IN_KOREAN: {
      code: "INCLUDE_KOREAN",
      message: "Must be password include only english & number",
    },
  },
  EMPTY_INFO: {
    USER_ID: {
      code: "EMPTY_USER_ID",
      message: "User ID is required.",
    },
    USER_PASSWORD: {
      code: "EMPTY_USER_PASSWORD",
      message: "User Password is required.",
    },
    USERNAME: {
      code: "EMPTY_USERNAME",
      message: "Username is required.",
    },
  },
  EXISTS_ID: {
    code: "EXISTS_USER_ID",
    message: "The user id already exists",
  },
  NOT_EXISTS_USER: {
    code: "NOT_EXISTS_USER",
    message: "The User Not found",
  },
  OTHER: {
    code: "UNKNOWN",
    message: "Unknown Error",
  },
  TOKEN_EXPIRED: {
    code: "EXPIRED_TOKEN",
    message: "Token re-issuance required",
  },
  TOKEN_NOT_EXPIRED: {
    code: "NOT_EXPIRED_TOKEN",
    message: "Not Expired Token",
  },
  TOKEN_INVALID: {
    code: "INVALID_TOKEN",
    message: "Invalid Token",
  },
  TOKEN_EMPTY: {
    code: "EMPTY_TOKEN",
    message: "Token is Empty",
  },
  TOKEN_OR_REFRESH_EMPTY: {
    code: "EMPTY_TOKEN_OR_REFRESH_TOKEN",
    message: "Token or Refresh Token is Empty",
  },
  USER_INVALID: {
    code: "INVALID_USER",
    message: "Please login again",
  },
};
