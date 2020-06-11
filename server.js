const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colours = require("colors");

const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// environment vars
dotenv.config({ path: "./config/config.env" });

// connect to db
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps");

const app = express();

// body parser
app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/bootcamps", bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//handle
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error:${err.message}`);
  // close server and exit
  server.close(() => process.exit(1));
});
