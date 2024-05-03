import session from "express-session";
import passport from "passport";
import "dotenv/config";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jsonwebtoken from "jsonwebtoken";
import LocalStrategy from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";

/* Local strategy - username + password authentication */

// verify username + hashed password
const LocalAuth = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: "Incorect username" });
    }
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return done(null, false, { message: "Incorect password" });
    }
    const jwt = issueJWT(user);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

/* JSON Web Token Strategy - authorize using JWT */

// issue JWT
function issueJWT(user) {
  const _id = user._id;
  const expiresIn = "14d";
  const payload = {
    sub: _id,
    iat: Date.now(),
  };
  const signedToken = jsonwebtoken.sign(payload, process.env.RSA_PRIVATE_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });
  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

// verify JWT
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.RSA_PUBLIC_KEY,
  algorithms: ["RS256"],
};

const JwtAuth = new JwtStrategy(options, (payload, done) => {
  User.findOne({ _id: payload.sub })
    .then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err, null));
});

const authJWT = passport.authenticate("jwt", { session: false });

export { LocalAuth, JwtAuth, issueJWT, authJWT };

/*

curl http://localhost:3000/auth/check

curl http://localhost:3000/auth/login -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password": ""}'

curl http://localhost:3000/api/ -X POST -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lIjoiYXNpYSJ9LCJpYXQiOjE3MTQ1MDE3Nzd9.T0vxq5qjDsjX70Ta1zfQdCNBhTXC0tUoOX2e29oOcoo" -d '{"title": "Second article", "content": "This is the content"}'

*/
