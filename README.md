🏡 StaySphere

StaySphere is a full-stack MERN application inspired by Airbnb that allows users to create, view, edit, and delete property listings.
The project focuses on clean REST APIs, proper state management in React, and real-world CRUD workflows.

⚙️ Tech Stack

Frontend

React

React Router DOM

Axios

Tailwind CSS (if used)

Backend

Node.js

Express.js

MongoDB

Mongoose

CORS

✨ Features

📄 View all listings

🔍 View single listing details

➕ Create new listings

✏️ Edit existing listings

❌ Delete listings (real-time UI update, no refresh)

🔗 RESTful API architecture

📂 Project Structure
StaySphere/
│
├── backend/
│   ├── models/
│   ├── app.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md

🚀 Getting Started
1️⃣ Clone the repository
git clone https://github.com/your-username/staysphere.git

2️⃣ Backend Setup
cd backend
npm install
node app.js

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🌐 API Endpoints
Method	Endpoint	Description
GET	/listings	Get all listings
GET	/listings/:id	Get single listing
POST	/listings	Create listing
PUT	/listings/:id	Update listing
DELETE	/listings/:id	Delete listing