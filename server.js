const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colours = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xssclean = require("xss-clean");
const expressRateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// environment vars
dotenv.config({ path: "./config/config.env" });

// connect to db
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

const app = express();

// body parser
app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(mongoSanitize());
app.use(fileupload());
app.use(cookieParser());
app.use(helmet());
app.use(xssclean());
app.use(
  expressRateLimit({
    windowMs: 10 * 60 * 1000, //10 mins
    max: 100,
  })
);
app.use(xssclean());
app.use(cors());

//static folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

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
