const User = require("../models/user")
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs")
}
module.exports.signup = async (req, res) => {
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
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs')
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)

}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        //logout is func by passport to logout user if some error occurs send it to middleware
        if (err) {
            return next(err)
        }
        req.flash("success", "You are logged out  now")
        res.redirect('/listings')
    });

}