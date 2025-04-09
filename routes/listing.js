const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')

const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const listingControlller = require("../controllers/listing.js")
//  multer is used to procees files from form and store files in uploads folder but we change it to cloudianry storage
const multer = require('multer');
const { storage } = require('../cloudConfig.js')
const upload = multer({ storage })//store files in cloudinary storage
//we combine routes with common path
router.route('/')
    .get(wrapAsync(listingControlller.index))//Index route
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingControlller.createListing))//create route


//new route- place this above show route
router.get("/new", isLoggedIn, listingControlller.renderNewForm)


router.route("/:id")
    .get(wrapAsync(listingControlller.showListing))//show route
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingControlller.updateListing))//update route 
    .delete(isLoggedIn, isOwner, wrapAsync(listingControlller.destroyListing));


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingControlller.renderEditForm))//edit route

module.exports = router; 