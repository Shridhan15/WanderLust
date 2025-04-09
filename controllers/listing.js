const Listing= require("../models/listing")
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}

module.exports.renderNewForm= (req, res) => {
    // console.log(req.user);// undefined if not logged in

    res.render("listings/new.ejs")
}

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate('owner');
    //populate method is used to sent review object
    if (!listing) {

        req.flash("error", "Listing you requested for doest not exist!")
        res.redirect('/listings')
    }
    // console.log(listing)
    res.render("listings/show.ejs", { listing })


}

module.exports.createListing=async (req, res, next) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing")
    // }
    //earlierly we were using above method to validate but we had to do that for every key(price,location etc), middleware is better way using Joi
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting = Listing(req.body.listing);
    // console.log("This is new listing", koreq.user._id)
    newlisting.owner = req.user._id;//store userid as owner (current logged in user) using passport
    newlisting.image={url,filename}
    await newlisting.save();
    req.flash("success", "New listing created")
    res.redirect("/listings")

}

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for doest not exist!")
        res.redirect('/listings')
    }
    res.render("listings/edit.ejs", { listing })


}

module.exports.updateListing=async (req, res) => {
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
}

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted", deletedListing);
    req.flash("success", "Listing Deleted")
    res.redirect("/listings");

}