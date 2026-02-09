const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listings.models.js');
const {data} = require("./init/data.js")
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';
async function main(){
  await mongoose.connect(MONGO_URL);
}

main()
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log(err));



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get("/listings", async(req,res)=>{
  try {
    const listings = await Listing.find({});
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Error fetching listings" });
  }
})

app.get("/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    res.json(listing);
  } catch (err) {
    res.status(404).json({ error: "Listing not found" });
  }
});


app.post("/listings", async (req, res) => {
  try{
    const newListing = new Listing(req.body);
    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/listings/:id", async (req, res) => {
  try{
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    if(!updatedListing){
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(updatedListing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
})

app.delete("/listings/:id", async (req, res) => {
  try{
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);
    if(!deletedListing){
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})