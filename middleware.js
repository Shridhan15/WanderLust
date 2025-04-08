const Listing = require('./models/listing.js')
const Review = require('./models/review.js')
const { listingSchema } = require('./schema.js')
const ExpressError = require('./utils/ExpressError.js')
const { reviewSchema } = require('./schema.js')

module.exports.isLoggedIn = (req, res, next) => {
    console.log("User is", req.user)
    //if logged out user is trying to create a listing, we rediret it to login page after login it should be redirected to new listing page not to the home page
    // console.log(req)//req body has lots of objects
    console.log(req.path, '..', req.originalUrl)//prints path and original path
    if (!req.isAuthenticated()) {// a method by passport to check if user is logged in
        //save the redirect url to redirect it after login
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "You must be logged in to create a listing")
        return res.redirect('/login')
    }
    next();
}
//after login, passport resets the session so we need to store the redirectUrl in local to make other routes access it
// use it using another middleware 

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {

        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;

    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "you are not the owner of listing")
        return res.redirect(`/listings/${id}`);
    }
    next()
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    // console.log(result)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    // console.log(result)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;

    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "you are not the author of review")
        return res.redirect(`/listings/${id}`);
    }
    next()
}
