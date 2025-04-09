const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')

const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const listingControlller = require("../controllers/listing.js")

//we combine routes with common path
router.route('/')
    .get(wrapAsync(listingControlller.index))//Index route
    .post(isLoggedIn, validateListing, wrapAsync(listingControlller.createListing))//create route


//new route- place this above show route
router.get("/new", isLoggedIn, listingControlller.renderNewForm)


router.route("/:id")
    .get(wrapAsync(listingControlller.showListing))//show route
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingControlller.updateListing))//update route 
    .delete(isLoggedIn, isOwner, wrapAsync(listingControlller.destroyListing));


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingControlller.renderEditForm))//edit route

module.exports = router; 