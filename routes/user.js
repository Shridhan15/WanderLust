const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const wrapAsync = require('../utils/wrapAsync')
const passport = require('passport')

router.get('/signup', (req, res) => {
    res.render("users/signup.ejs")
})
router.post('/signup', wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password)
        console.log("new user ", registeredUser)
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust")
            res.redirect('/listings')
        });//login user automatically after signup using passport, it then stores the user info in req.user

    }
    catch (e) {
        req.flash("error", e.message)
        res.redirect('/signup')
    }
}))



router.get('/login', (req, res) => {
    res.render('users/login.ejs')
})

//for login passport's authenticate function(middleware) checks if user exits or not
router.post('/login', passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust")
    res.redirect("/listings")

})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        //logout is func by passport to logout user if some error occurs send it to middleware
        if (err) {
            return next(err)
        }
        req.flash("success", "You are logged out  now")
        res.redirect('/listings')
    });

})




module.exports = router