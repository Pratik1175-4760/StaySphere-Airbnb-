const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listings.models.js');

const MongoURI = 'mongodb://127.0.0.1:27017/airbnb';

main()
  .then(() => console.log('Database connection successful'))
  .catch((err) => console.error('Database connection error:', err));

async function main() {
  await mongoose.connect(MongoURI);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Database initialized with sample data");
}

initDB();