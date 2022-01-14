const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { findById } = require("../models/User");
require("dotenv").config();


const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  req.session.browserInfo = req.headers["user-agent"];
  // check json web token exists & is verified

  if (token) {
    jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
      if (decodedToken.browserInfo === req.headers["user-agent"]) {
        console.log(decodedToken);
        console.log(req.session);
        next();
      } else {
        console.log(err);

        res.redirect("/login");
      }
    });
  } else {
    res.redirect("/login");
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_KEY , async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        let allUser = await User.find({});
        res.locals.allUser = allUser;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
