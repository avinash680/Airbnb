const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");



router.get("/signup" , (req, res) => {
    res.render("users/signup");
})


router.post("/signup", wrapAsync( async(req, res) => {
   try { 
    let { username , email, password} = req.body;
    const  newUser =  new User({email, username});
    const registerUser = await User.register(newUser, password);
   
    // Automatically log in the user after signup
    req.login(registerUser, (err) => {
        if (err) {
            req.flash("error", "Account created but login failed. Please try logging in.");
            return res.redirect("/login");
        }
        req.flash("success", "Welcome to Airbnb!");
        res.redirect("/listings");
    });
   }  catch(e) {
    // Extract short error message
    let errorMsg = e.message;
    if (errorMsg.includes('\n') || errorMsg.length > 150) {
        errorMsg = errorMsg.split('\n')[0].substring(0, 150);
    }
    // Make common errors more user-friendly
    if (errorMsg.includes('E11000')) {
        errorMsg = "Username or email already exists!";
    } else if (errorMsg.includes('validation')) {
        errorMsg = "Invalid input. Please check your data.";
    }
    req.flash("error", errorMsg);
    res.redirect("/signup");
   }
}));

router.get("/login" , (req, res) => {
    res.render("users/login");
});

router.post("/login", saveRedirectUrl, 
  passport.authenticate("local", { 
    failureRedirect: '/login',
    failureFlash: true
  }),
  wrapAsync(async(req, res) => {
    req.flash("success", "Welcome back to Airbnb!");
    res.redirect(res.locals.redirectUrl || "/listings");
  })
);


router.get("/logout", (req, res, next) => {
     req.logout((err) => {
        if(err) {
           return next(err);
        }
        req.flash("success", "you are loggrd out!");
        res.redirect("/listings");
     })
})



 
module.exports = router;