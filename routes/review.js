const express = require('express')
const router = express.Router({ mergeParams: true });//merger params is set to get parent route in child
const wrapAsync = require('../utils/wrapAsync.js')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js')
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")



//reviews post route
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id;
    // console.log("New review", newReview)
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log("new review saved");
    req.flash("success", "New review created")
    res.redirect(`/listings/${listing._id}`)
}))

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params
    //mongo pull operator- removes from an existing array all  instances of a value or values  

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })// remove reviewId(review) from review array of listing
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted")
    res.redirect(`/listings/${id}`)
}))

module.exports = router