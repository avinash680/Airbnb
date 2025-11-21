const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const reviews = require("./routes/review.js");
const listings = require("./routes/listing.js");
const users = require("./routes/user.js");
const passport = require("passport");
require("./utils/passport.js");





async function main() {
    await mongoose.connect(MONGO_URL);
  }
  
  main()
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      console.error("Error connecting to DB:", err);
    });


    
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// Session configuration
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Make flash messages and current user available to all views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Debug request logger (temporary)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.get("/", (req, res) => {
    res.send("i am root");
});




app.use("/listings/:id/reviews", reviews);
app.use("/listings", listings);
app.use("/", users);



// 404 handler for unmatched routes
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    
    // Extract only the short error message (not stack trace)
    let shortMessage = message;
    
    // If message is too long or contains stack trace, extract first line only
    if (message.includes('\n') || message.length > 200) {
        shortMessage = message.split('\n')[0].substring(0, 200);
    }
    
    // Set flash error message
    req.flash("error", shortMessage);
    
    // Redirect based on status code
    if (status === 404) {
        res.redirect("/listings");
    } else {
        // For other errors, try to redirect back or to listings
        const redirectUrl = req.originalUrl.includes('/listings') ? '/listings' : '/listings';
        res.redirect(redirectUrl);
    }
});


// app.get("/testListing", async(req, res) => {
//       let sampleLis = new Listing({
//         title: "my new villa",
//         description: "By the beach",
//         price: 1200, 
//         location: "calangute, goe ",
//         country: "india",
//       });
//       await sampleLis.save();
//       console.log("sample was saved");
//       res.send("successful")
//     });


 app.listen(8080,  () => {
    console.log(`server is listening  this 8080`);
 });