import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../../models/User.js";

function passportConfig(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      (email, password, done) => {
        console.log("Authenticating...");
        User.findOne({ email })
          .select("+password")
          // eslint-disable-next-line consistent-return
          .exec((err, user) => {
            if (err) throw err;
            if (!user)
              return done(null, false, { msg: "Invalid email/password" });
            bcrypt.compare(password, user.password, (err2, isMatch) => {
              if (err2) throw err2;
              if (isMatch) {
                return done(null, user);
              }
              return done(null, false, { msg: "Invalid email/password" });
            });
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

export default passportConfig;
