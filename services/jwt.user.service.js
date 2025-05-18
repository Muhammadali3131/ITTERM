const config = require("config");
const jwt = require("jsonwebtoken");

class JwtSercive {
  constructor(accessKey, refreshKey, accessTime, refreshTime) {
    this.accessKey = accessKey;
    this.refreshKey = refreshKey;
    this.accessTime = accessTime;
    this.refreshTime = refreshTime;
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.accessKey, {
      expiresIn: this.accessTime,
    });
    const refreshToken = jwt.sign(payload, this.refreshKey, {
      expiresIn: this.accessTime,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessToken(token) {
    return jwt.verify(token, this.accessKey);
  }

  async verifyRefreshToken(token) {
    return jwt.verify(token, this.refreshKey);
  }
}

module.exports = new JwtSercive(
  config.get("access_key_user"),
  config.get("refresh_key_user"),
  config.get("access_time_user"),
  config.get("refresh_time_user")
);
