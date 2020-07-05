var passport = require("passport");
const { createUser } = require("../controllers/users");
var Strategy = require("passport-twitter").Strategy;

const pass = function (passport) {
  passport.use(
    new Strategy(
      {
        consumerKey: process.env["TWITTER_CONSUMER_KEY"],
        consumerSecret: process.env["TWITTER_CONSUMER_SECRET"],
        callbackURL: "http://localhost:5000/api/v1/recommendations",
      },
      async (token, tokenSecret, profile, cb) => {
        // In this example, the user's Twitter profile is supplied as the user
        // record.  In a production-quality application, the Twitter profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.

        console.log("here");
        console.log(profile);
        // createUser(profile);

        return cb(null, profile);
      }
    )
  );

  passport.serializeUser(function (user, cb) {
    console.log("user");
    cb(null, user);
  });

  passport.deserializeUser(function (obj, cb) {
    console.log("profile");
    cb(null, obj);
  });
};

module.exports = pass;
