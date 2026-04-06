# LogiEdge Billing Dashboard

A full‑stack billing dashboard application built with React on the frontend, Node.js/Express for the backend, and PostgreSQL as the database.  
It provides invoice management, billing details, and a clean UI styled with custom CSS.

Tech Stack
- Frontend:React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- HTTP Client: Axios
- Routing: React Router DOM
- Styling: Custom CSS 

# Setup instruction
For clone 
git clone https://github.com/Mittal-Divyanshu/LogiEdge-Assignment.git
cd LogiEdge-Assignment

cd frontend
npm install

cd backend 
npm install


Now,

Create a .env file in the backend folder
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=  your postgre password
DB_NAME=billing_db


Now create a schema.sql file in  backend folder by google drive uploaded file and run command 
psql -U your_username -d logiedge_db -f schema.sql


So,at last to start
npm run dev 
on two terminal one for backend and one for frontend
