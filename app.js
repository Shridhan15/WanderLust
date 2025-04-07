const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverrride = require("method-override");
const ejsMate = require("ejs-mate");//helps in creating layout (boilderplate)
const ExpressError = require('./utils/ExpressError.js')
const session = require('express-session')
const flash = require('connect-flash')
const passport=require('passport')
const LocalStratergy=require('passport-local')
const User=require('./models/user.js')

const listingsRouter = require('./routes/listing.js')
const reviewsRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')

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

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,//this is in miliseconds
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};
app.get("/", (req, res) => {
    res.send("Hii, i an root")
})

app.use(session(sessionOptions))//to check if session is working, inspect and look for connect.side in application 
app.use(flash())

// *password use session also
app.use(passport.initialize())//middleware to init passport
app.use(passport.session())//we want to have user to stay logged in for a session, he need not log in again and again for a request
passport.use(new LocalStratergy(User.authenticate()))

passport.serializeUser(User.serializeUser())//store user's info in session while he login, to avoid login again and again 
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user;
    // console.log(res.locals.success)
    next();
})


// app.get("/demouser",async (req, res) => {
//     let fakeuser= new User({
//         email:"student@gmail.com",
//         username:"delta-user",//username is added by passport
//     })

//     let registeredUser= await User.register(fakeuser,"helloworld")//passing user and password 
//     //register is a predefined method to register user 
//     res.send(registeredUser)
// })


app.use('/listings', listingsRouter)
app.use('/listings/:id/reviews', reviewsRouter)
app.use('/',userRouter)


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





