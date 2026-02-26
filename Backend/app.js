const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Listing = require('./models/listing.models.js');
const Review = require('./models/review.models.js');
const {data} = require("./init/data.js");
const cors = require('cors');

const listingRouter = require('./routes/listing.routes.js');
const reviewRouter = require('./routes/review.routes.js');
const userRouter = require('./routes/user.routes.js');

const app = express();
const PORT = 3000;
const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';

// Database connection
async function main(){
  await mongoose.connect(MONGO_URL);
  
  const count = await Listing.countDocuments();
  if (count === 0) {
    console.log('No listings found. Run /init route to seed database.');
  }
}

main()
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log(err));

// MIDDLEWARE (CORRECT ORDER)
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use('/', userRouter);
app.use('/', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);

// Initialize/Reset database
app.get("/init", async (req, res) => {
  try {
    const User = require('./models/user.models.js');
    
    // 1. Clear all data
    await Listing.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    
    // 2. Create demo user
    const demoUser = new User({
      username: 'demo',
      email: 'demo@example.com',
      password: 'Demo123'
    });
    await demoUser.save();
    
    // 3. Add owner to all sample listings
    const listingsWithOwner = data.map(listing => ({
      ...listing,
      owner: demoUser._id
    }));
    
    // 4. Insert listings
    await Listing.insertMany(listingsWithOwner);
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Database Initialized</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px;
            background: #f5f5f5;
          }
          .card {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 { color: #e91e63; }
          .credentials {
            background: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          a {
            display: inline-block;
            background: #e91e63;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          a:hover { background: #c2185b; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>✅ Database Initialized Successfully!</h1>
          <p><strong>${data.length} listings</strong> have been added to the database.</p>
          
          <div class="credentials">
            <h3>Demo Account Credentials:</h3>
            <p>👤 <strong>Username:</strong> demo</p>
            <p>🔒 <strong>Password:</strong> Demo123</p>
          </div>
          
          <p>You can now login with these credentials to:</p>
          <ul>
            <li>View all listings</li>
            <li>Edit demo listings</li>
            <li>Delete demo listings</li>
            <li>Create new listings</li>
          </ul>
          
          <a href="http://localhost:5173">Go to App →</a>
        </div>
      </body>
      </html>
    `);
    
  } catch (err) {
    console.error('Database initialization error:', err);
    res.status(500).send(`
      <h1>Error Initializing Database</h1>
      <p>${err.message}</p>
      <pre>${err.stack}</pre>
    `);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});