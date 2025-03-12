const express= require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing")
const path=require("path");
const methodOverrride=require("method-override");
const ejsMate=require("ejs-mate");//helps in creating layout (boilderplate)


app.use(methodOverrride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));//to use static files in public folder css etx

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


//new route- place this above show route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})



//show route
app.get("/listings/:id", async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
    

})


//create route
app.post("/listings", async (req,res)=>{
    const newlisting=Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings")
})


//edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})


})


//update route 
app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`);
})


//delete route
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");

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