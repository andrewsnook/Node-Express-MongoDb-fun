var passport = require("passport");
const Twitter = require("twitter");
const User = require("../models/User");
var Strategy = require("passport-twitter").Strategy;

const pass = function (passport) {
  passport.use(
    new Strategy(
      {
        consumerKey: process.env["TWITTER_CONSUMER_KEY"],
        consumerSecret: process.env["TWITTER_CONSUMER_SECRET"],
        callbackURL: "http://localhost:5000/api/v1/auth/twitter/callback",
      },
      async function (token, tokenSecret, profile, cb) {
        let twitterUser = await User.findOne({
          email: profile.id + "@mail.com",
        });

        if (twitterUser === null) {
          twitterUser = new User();
          twitterUser.twitteraccount = true;
          twitterUser.name = profile.username;
          twitterUser.role = "user";
          twitterUser.email = profile.id + "@mail.com"; // hack to get a unique temporary email in place.
          User.create(twitterUser);
        }

        // get twitter friends
        const client = new Twitter({
          consumer_key: process.env["TWITTER_CONSUMER_KEY"],
          consumer_secret: process.env["TWITTER_CONSUMER_SECRET"],
          access_token_key: token,
          access_token_secret: tokenSecret,
        });

        client.get("friends/list", function (error, friends, response) {
          if (!error) {
            var co = { ...profile, ...friends };
            profile["twitterfriends"] = friends;

            console.log(co);
            return cb(null, co);
          } else {
            console.log(error);
          }
        });
        return cb(null, profile);
      }
    )
  );

  passport.serializeUser(function (co, cb) {
    cb(null, co);
  });

  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });
};

module.exports = pass;
