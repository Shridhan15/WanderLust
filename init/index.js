const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "67f3aceb81389d2278ad934c" }))//addeing owner to every listing,(username:demp, password:demo),adding the same owner for every listing initially
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();