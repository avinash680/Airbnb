const express = require("express");
const app =  express();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

const sessionOptions = {
    secret: "mylaptop",
    saveUninitialized: true,
};


app.use(session(sessionOptions));
app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// app.use(req, res,)


app.get("/register", (req, res) => {
    let { name  = "avinash"} = req.query;
    req.session.name = name;
    if(name === "avinash") {
       req.flash("error", "user not registered");  
    }else {
    req.flash("success", "user registered successfully");
    }
    res.redirect("/hello");
});


app.get("/hello", (req, res) => {
   res.locals.successmsg = req.flash("success");
   res.locals.errormsg = req.flash("error")
    res.render("page.ejs", { name: req.session.name});
});


app.listen(3000, () =>  {
    console.log("server is listening to 3000");
}
)