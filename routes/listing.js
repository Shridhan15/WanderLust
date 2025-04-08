const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')

const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")


//Index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}))


//new route- place this above show route
router.get("/new", isLoggedIn, (req, res) => {
    // console.log(req.user);// undefined if not logged in

    res.render("listings/new.ejs")
})



//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate('owner');
    //populate method is used to sent review object
    if (!listing) {

        req.flash("error", "Listing you requested for doest not exist!")
        res.redirect('/listings')
    }
    // console.log(listing)
    res.render("listings/show.ejs", { listing })


}))


//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing")
    // }
    //earlierly we were using above method to validate but we had to do that for every key(price,location etc), middleware is better way using Joi

    const newlisting = Listing(req.body.listing);
    // console.log("This is new listing", koreq.user._id)
    newlisting.owner = req.user._id;//store userid as owner (current logged in user) using passport
    await newlisting.save();
    req.flash("success", "New listing created")
    res.redirect("/listings")

}))


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for doest not exist!")
        res.redirect('/listings')
    }
    res.render("listings/edit.ejs", { listing })


}))


//update route 
//we will first check if user is logged in then check if user is owner of particular listing then procced with update
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body.listing;

    let listing = await Listing.findById(id);


    listing.title = data.title;
    listing.description = data.description;
    listing.price = data.price;
    listing.location = data.location;
    listing.country = data.country;

    if (data.image) {
        listing.image = {
            url: data.image,
            filename: "listingimage" // optional, or generate dynamically
        };
    }

    await listing.save();
    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`);
}));


//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted", deletedListing);
    req.flash("success", "Listing Deleted")
    res.redirect("/listings");

}))

module.exports = router; 