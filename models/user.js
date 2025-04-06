const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose')
// passportLocalMongoose add a findByUsername,hash and salt field to store username and the hashed password and salt value 
const userSchema= new Schema({
    email:{
        type:String,
        required:true,
    },
    //username and password are created by passportLocalMongoose
})

userSchema.plugin(passportLocalMongoose)// to create usename and password
module.exports=mongoose.model("User",userSchema)