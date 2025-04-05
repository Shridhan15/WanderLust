const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: String,
        url: {
            type: String,
            default: "https://s3.india.com/wp-content/uploads/2024/03/Feature-Image_-Goa-1.jpg",
        },
    },
    price: Number,
    location: String,
    country: String,

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});


//for delete the reviews of a listing after deleting listing
listingSchema.post("findOneAndDelete", async (listing) => {

    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
