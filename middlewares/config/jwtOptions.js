module.exports = {
  secretKey: "woowakgood", // 원하는 시크릿
  options: {
    algorithm: "HS256", // 해싱 알고리즘
    expiresIn: "10s", // 토큰 유효 기간
    issuer: "happi3r", // 발행자
  },
  refreshTokenOptions: {
    algorithm: "HS256", // 해싱 알고리즘
    expiresIn: "14d", // 토큰 유효 기간
    issuer: "happi3r", // 발행자
  },
};
