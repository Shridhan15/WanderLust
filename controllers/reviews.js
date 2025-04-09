const Listing=require("../models/listing")
const Review=require("../models/review")
module.exports.createReview=async (req, res) => {
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
}

module.exports.destroyReview=async (req, res) => {
    let { id, reviewId } = req.params
    //mongo pull operator- removes from an existing array all  instances of a value or values  

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })// remove reviewId(review) from review array of listing
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted")
    res.redirect(`/listings/${id}`)
}