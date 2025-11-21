const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const { authenticate } = require("passport");
const { isLoggedIn } = require("../middleware.js");



const validateListing = (req, res, next) => {
        let {error} = listingSchema.validate(req.body);
  
  if(error) {
    // Create shorter, user-friendly error messages`
    let errMsg = error.details.map(el => {
        // Extract field name and message
        let msg = el.message;
        // Remove quotes and make it shorter
        msg = msg.replace(/"/g, '');
        return msg;
    }).join(", ");
    // Limit total message length
    if (errMsg.length > 150) {
        errMsg = errMsg.substring(0, 150) + "...";
    }
    throw new ExpressError(400, errMsg);
  }else {
     next();
  }
};


const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


// Index Route (mounted at /listings)
router.get("/", wrapAsync(async (req, res) => {
  const  allListings =   await Listing.find({});
  res.render("listings/index", { allListings });
}));

// New Route 
router.get("/new", isLoggedIn,  (req, res) => {
  res.render("listings/new.ejs");
}); 

//show Route (trim and validate id)
router.get("/:id", wrapAsync(async (req, res) => {
     let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate('owner');
     if(!listing) {
       req.flash("success", "Listing you requested for does not exist!");
       return res.redirect("/listings");
     }
     res.render("listings/show.ejs", { listing });
}));


//Create Route

router.post("/", validateListing, isLoggedIn,  wrapAsync (async (req,res) => {
  // Convert image string to image object structure
  const listingData = {...req.body.listing};
  if (listingData.image) {
    listingData.image = {
      url: listingData.image,
      filename: "listingimage"
    };
  }
  // assign owner from authenticated user
  if (req.user && req.user._id) {
    listingData.owner = req.user._id;
  }
  const newListing = await Listing.create(listingData);
  req.flash("success", "New Listing Created!");
  res.redirect(`/listings/${newListing._id}`);
  
}));

//Edit Route 
router.get("/:id/edit",  isLoggedIn,  wrapAsync(async(req, res) => {
    let { id } = req.params;
    const listing  = await Listing.findById(id);
     if(!listing) {
       req.flash("success", "Listing you requested for does not exist!");
       return res.redirect("/listings");
     }
    res.render("listings/edit.ejs", { listing });

}));

// update route
router.put("/:id", validateListing,isLoggedIn, wrapAsync( async (req, res) => {
      let { id } = req.params;
   if(!req.body.listing) {
       throw new  ExpressError(400, "send vaild data for listing");
     }
     // Convert image string to image object structure
     const updateData = {...req.body.listing};
     if (updateData.image) {
       updateData.image = {
         url: updateData.image,
         filename: "listingimage"
       };
     }
      await  Listing.findByIdAndUpdate(id, updateData);
    req.flash("success", " Listing Updated!");
   
      res.redirect("/listings");

}));


// delete route
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
   req.flash("success", "Listing Deleted!");
  res.redirect("/listings");

}));




module.exports = router;