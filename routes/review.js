const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// Temporary: log all requests hitting this router
router.use((req, res, next) => {
  console.log(`[reviews-router] ${req.method} ${req.originalUrl}`);
  next();
});

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    // Create shorter, user-friendly error messages
    let errMsg = error.details.map((el) => {
        let msg = el.message;
        msg = msg.replace(/"/g, '');
        return msg;
    }).join(", ");
    // Limit total message length
    if (errMsg.length > 150) {
        errMsg = errMsg.substring(0, 150) + "...";
    }
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


// Temporary: quick GET to verify mount works
router.get("/", (req, res) => {
  res.status(200).send("reviews router OK");
});

// Create review for a listing
router.post("/", validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
   req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
}));

// Delete a review from a listing
router.delete("/:reviewId", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;