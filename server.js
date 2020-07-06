const path = require("path");
const express = require("express");
var passport = require("passport");
var Strategy = require("passport-twitter").Strategy;
var expressSession = require("express-session");
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
require("./config/passport")(passport);
// connect to db
connectDB();

const app = express();

app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Route files
const recommendations = require("./routes/recommendations");
const auth = require("./routes/auth");
const users = require("./routes/users");
const deepdives = require("./routes/deepdives");

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

app.use("/api/v1/recommendations", recommendations);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/deepdives", deepdives);

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
