module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user)
    if (!req.isAuthenticated()) {// a method by passport to check if user is logged in
        req.flash("error", "You must be logged in to create a listing")
        return res.redirect('/login')
    }
    next();
}