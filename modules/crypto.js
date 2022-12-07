const crypto = require("crypto");
const {
  WRONG_PASSWORD: { IN_KOREAN },
} = require("./Error");
const hashFunc = "sha512";
const outputType = "base64";

const encodePassword = (password) => {
  const isNotKoreanRegex = RegExp("^[a-zA-Z0-9]*$");
  if (!isNotKoreanRegex.test(password)) throw IN_KOREAN;

  return crypto.createHash(hashFunc).update(password).digest(outputType);
};

module.exports = encodePassword;
