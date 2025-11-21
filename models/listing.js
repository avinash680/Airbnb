const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title:  {
   
      type: String,
      required: true
   
    },
    description: String,
   
   
   image: {
   	filename: {
   		type: String,
   		default: "listingimage"
   	},
   	url: {
   		type: String,
   		default: "https://unsplash.com/photos/silhouette-of-palm-tree-near-body-of-water-during-sunset-CXyz3qljaH8",
   		set: (v) => v === "" ? "https://unsplash.com/photos/silhouette-of-palm-tree-near-body-of-water-during-sunset-CXyz3qljaH8" : v,
   	}
   } ,
    price: Number,
    location: String,
    country: String,
    
   reviews: [
      {
         type: Schema.Types.ObjectId,
          ref: "Review",
      }
   ]





  });



  listingSchema.post("findOneAndDelete", async (listing) => {
     if(listing) {
       await Review.deleteMany({_id: {$in: listing.reviews}});     
     }
      })





module.exports = mongoose.model("Listing", listingSchema);