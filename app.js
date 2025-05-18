const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const indexRouter = require("./routes/index.routes");
const errorHandlingMiddleware = require("./middlewares/error/error-handling.middleware");
const logger = require("./services/logger.service");

const PORT = config.get("port") || 3030;

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
// const
const winston = require("winston")
const expressWinston = require("express-winston");
const requestErrorLogger = require("./middlewares/loggers/request.error.logger");
const requestLogger = require("./middlewares/loggers/request.logger");

// logger.log("info","Oddiy LOG ma'lumot"); // universal
// logger.error("Error ma'lumot");
// logger.debug("Debug ma'lumot");
// logger.warn("Warn ma'lumot");
// logger.info("Info ma'lumot");

// logger.trace("Trace ma'lumot");
// console.table(["JS", "Python", "Java"]);
// console.table([
//   ["Karim", 5],
//   ["Salim", 2],
//   ["Ali", 3],
// ]);


// console.log(process.env.NODE_ENV);
// console.log(process.env.secret_token);
// console.log(config.get("secret_token"));

// process.on("uncaughtException", (exception) => {
//   console.log("uncaughtException:", exception.message);
// });

// process.on("unhandledRejection", (rejection) => {
//   console.log("unhandledRejection:", rejection);
// });

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(requestLogger);

app.use("/api", indexRouter); // backend

app.use(requestErrorLogger);

app.use(errorHandlingMiddleware); // error handling eng oxirida yozilishi kerak

async function start() {
  try {
    const uri = config.get("dbUri");
    await mongoose.connect(uri);
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();
