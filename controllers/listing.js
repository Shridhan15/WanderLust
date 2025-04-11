const Listing = require("../models/listing")
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}

module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);// undefined if not logged in

    res.render("listings/new.ejs")
}

module.exports.showListing = async (req, res) => {
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

module.exports.createListing = async (req, res, next) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing")
    // }
    //earlierly we were using above method to validate but we had to do that for every key(price,location etc), middleware is better way using Joi
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = Listing(req.body.listing);
    // console.log("This is new listing", koreq.user._id)
    newlisting.owner = req.user._id;//store userid as owner (current logged in user) using passport
    newlisting.image = { url, filename }
    await newlisting.save();
    req.flash("success", "New listing created")
    res.redirect("/listings")

}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for doest not exist!")
        res.redirect('/listings')
    }
    let originalImageUrl = listing.image.url;
    // blur the image while shoing original image in edit form
    originalImageUrl = originalImageUrl.replace('/upload', '/upload/w_250')
    res.render("listings/edit.ejs", { listing, originalImageUrl })


}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const data = req.body.listing;

    let listing = await Listing.findByIdAndUpdate(id, { ...data }, { new: true, runValidators: true });

    if (typeof req.file !== "undefined") {
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save(); // Save only if image updated
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted", deletedListing);
    req.flash("success", "Listing Deleted")
    res.redirect("/listings");

}