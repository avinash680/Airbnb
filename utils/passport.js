const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user.js");

// Configure passport-local strategy
passport.use(new LocalStrategy(User.authenticate()));

// Serialize user for session
passport.serializeUser(User.serializeUser());

// Deserialize user from session
passport.deserializeUser(User.deserializeUser());

module.exports = passport;

