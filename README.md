Team Task Manager
A full-stack, process-driven project management application built with the MERN stack. This platform allows teams to create isolated project workspaces, track feature tickets, and monitor real-time analytical metrics.

🚀 Features
Secure Authentication: Custom JWT-based user registration and login with bcrypt password hashing.
Project Workspaces: Users can create new projects (becoming the Admin) and view workspaces they are assigned to.
Task Management: Full interactive control over task creation, assigning priority levels, and setting due dates.
Interactive Pipeline: Real-time task status updates (To Do → In Progress → Done) that sync instantly with the database.
Live Analytics Dashboard: MongoDB aggregation pipelines drive dynamic metrics for Total Tasks, Overdue Tasks, and Status groupings.
🛠️ Tech Stack
Frontend:

React.js (Vite)
Tailwind CSS (v3)
React Router DOM
Axios (with API interceptors)
Lucide React (Icons)
Context API (Global State Management)
Backend:

Node.js & Express.js
MongoDB Atlas & Mongoose
JSON Web Tokens (JWT)
Bcrypt.js (Cryptography)
⚙️ Local Installation & Setup
Follow these instructions to run the project on your local machine.

1. Database Setup
Create a free cluster on MongoDB Atlas and get your connection string.

2. Backend Setup
Navigate to the backend directory and install dependencies:

cd backend
npm install


Create a .env file in the backend folder and add the following variables:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key
Start the backend server:


npm run dev
3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies:

Bash
cd frontend
npm install --legacy-peer-deps
Start the Vite development server:

Bash
npm run dev
The application will be running at http://localhost:5173.

👨‍💻 Author
Vishnu Kaushik
