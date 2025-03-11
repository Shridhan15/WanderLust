const express= require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing")

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err)
})
async function  main( ) {
    await mongoose.connect(MONGO_URL)
}

app.get("/",(req,res)=>{
    res.send("working")
})

app.get("/testlisting", async (req,res)=>{
    let sampleListing= new Listing({
        title:"My New Villa",
        description:"By the beach",
        price:1200,
        location:"Calangute, Goa",
        country:"India"
    })
    await sampleListing.save().then;
    console.log("sample saved");
    res.send("Success");
})

app.listen(8080,()=>{
    console.log("Server is listening on port 8080")
})