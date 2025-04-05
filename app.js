const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverrride = require("method-override");
const ejsMate = require("ejs-mate");//helps in creating layout (boilderplate)
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')
const { listingSchema, reviewSchema } = require('./schema.js')
const Review = require("./models/review.js")


app.use(methodOverrride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));//to use static files in public folder css etx

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err)
})
async function main() {
    await mongoose.connect(MONGO_URL)
}

app.get("/", (req, res) => {
    res.send("working")
})

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


const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    // console.log(result)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}




//Index route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}))


//new route- place this above show route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})



//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    //populate method is used to sent review object
    res.render("listings/show.ejs", { listing })


}))


//create route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing")
    // }
    //earlierly we were using above method to validate but we had to do that for every key(price,location etc), middleware is better way using Joi

    const newlisting = Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings")

}))


//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })


}))


//update route 
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {

    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`);
}))


//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted", deletedListing);
    res.redirect("/listings");

}))

//reviews post route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`)
}))

//delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params
    //mongo pull operator- removes from an existing array all  instances of a value or values  

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })// remove reviewId(review) from review array of listing
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
}))


// app.get("/testlisting", async (req,res)=>{
//     let sampleListing= new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India"
//     })
//     await sampleListing.save().then;
//     console.log("sample saved");
//     res.send("Success");
// })

//it matche with all routes if not found it thows this error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"))
    // status code and message is sent to next middleware
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    //above are default code and msg and will be displayed in case of no status and msg receinve from err
    // res.status(statusCode).send(message)
    res.status(statusCode).render("error.ejs", { err })
})

app.listen(8080, () => {
    console.log("Server is listening on port 8080")
})





