const express = require('express')
const router = express.Router({ mergeParams: true });//merger params is set to get parent route in child
const wrapAsync = require('../utils/wrapAsync.js')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js')
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")


const reviewController=require("../controllers/reviews.js")

//reviews post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router