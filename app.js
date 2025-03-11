const express= require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing")
const path=require("path");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));


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


//Index route
app.get("/listings", async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings})
})

//show route
app.get("/listings/:id", async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
    

})




// app.get("/testlisting", async (req,res)=>{
//     let sampleListing= new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India"
//     })
//     await sampleListing.save().then;
//     console.log("sample saved");
//     res.send("Success");
// })

app.listen(8080,()=>{
    console.log("Server is listening on port 8080")
})