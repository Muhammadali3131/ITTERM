const { sendErrorResponse } = require("../../helpers/send_error_response");
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res
        .status(401)
        .send({ message: "Authorization header berilmagan" });
    }

    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];

    if (bearer !== "Bearer" || !token) {
      return res.status(401).send({ message: "Bearer token berilmagan" });
    }

    const decodedPayload = jwt.verify(token, config.get("tokenKeyAdmin"));
    req.admin = decodedPayload;

    next();
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
