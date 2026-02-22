const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const Listing = require('./models/listings.models.js');
const Review = require('./models/review.models.js');
const {data} = require("./init/data.js");
const flash = require('connect-flash');
const cors = require('cors');
const listings = require('./routes/listings.js');
const reviews = require('./routes/review.js');

// 1. Session middleware (BEFORE cors and express.json)
const sessionOptions = { 
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,  // Changed to true
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
};const app = express();
const PORT = 3000;

const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';

async function main(){
  await mongoose.connect(MONGO_URL);
  
  const count = await Listing.countDocuments();
  if (count === 0) {
    await Listing.insertMany(data);
    console.log('Database seeded with sample data');
  }
}

main()
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log(err));

// MIDDLEWARE ORDER IS IMPORTANT!



app.use(session(sessionOptions));
app.use(flash());

// 2. CORS (AFTER session, configure properly for credentials)
app.use(cors({
  origin: 'http://localhost:5173',  // Your React app URL
  credentials: true  // Allow cookies/session
}));

// 3. Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Routes
app.use('/', listings);
app.use('/listings/:id/reviews', reviews);

// Initialize/Reset database
app.get("/init", async (req, res) => {
  await Listing.deleteMany({});
  await Review.deleteMany({});
  await Listing.insertMany(data);
  res.send("Database re-initialized with sample data");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


