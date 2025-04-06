const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const { listingSchema } = require('../schema.js')
const ExpressError = require('../utils/ExpressError.js')
const Listing = require("../models/listing.js")


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    // console.log(result)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}
//Index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}))


//new route- place this above show route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})



//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    //populate method is used to sent review object
    if (!listing) {

        req.flash("error", "Listing you requested for doest not exist!")
        res.redirect('/listings')
    }
    res.render("listings/show.ejs", { listing })


}))


//create route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing")
    // }
    //earlierly we were using above method to validate but we had to do that for every key(price,location etc), middleware is better way using Joi

    const newlisting = Listing(req.body.listing);
    await newlisting.save();
    req.flash("success", "New listing created")
    res.redirect("/listings")

}))


//edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for doest not exist!")
        res.redirect('/listings')
    }
    res.render("listings/edit.ejs", { listing })


}))


//update route 
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body.listing;

    const listing = await Listing.findById(id);

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
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted", deletedListing);
    req.flash("success", "Listing Deleted")
    res.redirect("/listings");

}))

module.exports = router; 