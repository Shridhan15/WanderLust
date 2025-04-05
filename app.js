const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverrride = require("method-override");
const ejsMate = require("ejs-mate");//helps in creating layout (boilderplate)
const ExpressError = require('./utils/ExpressError.js')


const listings = require('./routes/listing.js')
const reviews = require('./routes/review.js')

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

app.use('/listings', listings)
app.use('/listings/:id/reviews', reviews)


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





