const mongoose = require("mongoose");
const initData = require("./data.js");

const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';


async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "691feb2b4351b6309a6b7c95"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};




main()
  .then(async () => {
    await initDB();
    console.log("Initialization complete!");
    await mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Initialization error:", err);
    mongoose.connection.close();
  });