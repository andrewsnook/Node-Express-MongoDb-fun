var passport = require("passport");

const Twitter = require("twitter");
const { createUser } = require("../controllers/users");
var Strategy = require("passport-twitter").Strategy;

const pass = function (passport) {
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

        //console.log(profile);
        client.get("friends/list", function (error, friends, response) {
          if (!error) {
            console.log("no error getting friends");
          } else {
            console.log(error);
          }
        });

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
