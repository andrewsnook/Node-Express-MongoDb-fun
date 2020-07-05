const path = require("path");
const express = require("express");
var passport = require("passport");
var Strategy = require("passport-twitter").Strategy;
var expressSession = require("express-session");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colours = require("colors");
const Twitter = require("twitter");
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

passport.use(
  new Strategy(
    {
      consumerKey: process.env["TWITTER_CONSUMER_KEY"],
      consumerSecret: process.env["TWITTER_CONSUMER_SECRET"],
      callbackURL: "http://localhost:5000/api/v1/auth/twitter/callback",
    },
    function (token, tokenSecret, profile, cb) {
      // In this example, the user's Twitter profile is supplied as the user
      // record.  In a production-quality application, the Twitter profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.function (req, res) {
      const client = new Twitter({
        consumer_key: process.env["TWITTER_CONSUMER_KEY"],
        consumer_secret: process.env["TWITTER_CONSUMER_SECRET"],
        access_token_key: token,
        access_token_secret: tokenSecret,
      });
      console.log(client);
      //console.log(profile);
      client.get("friends/list", function (error, friends, response) {
        if (!error) {
          console.log(friends);
        } else {
          console.log(error);
        }
      });

      return cb(null, profile);
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

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
