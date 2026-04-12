"RIMTIFY – Faculty Management System (Web + Android APK)"

RIMTIFY is a full-stack faculty management system designed to simplify academic workflows inside universities. It allows teachers to manage attendance, student records, study materials, and notes in one centralized platform.

____________

🔗 Live App: https://preeti-kaur245.github.io/Rimtify/

📱 Download Android APK: https://median.co/share/nmjnmkq#apk
___________

⚡ Features
🔐 Authentication
Faculty Login / Registration
📊 Attendance Management
Mark attendance per course
Store attendance records
View attendance history
📅 Multi-Day Attendance Export
Export attendance for last N days
Fetch historical data from database
Sorted by date
📥 CSV Report Generation
Proper comma-separated format
UTF-8 with BOM (Excel compatible)
Handles special characters and commas
Clean column structure:
Date, Student Name, Student ID, Course, Attendance Status
📂 File Download
Auto-download as: attendance_report.csv
Works in Excel, Google Sheets, etc.
📁 Study Materials
Upload PDFs, images, and files
Retrieve and manage uploaded content
📝 Notes System
Create and save notes for teaching
🎓 Student Management
Course-wise student records
Add and manage student data


🛠 Tech Stack
Backend
Node.js
Express.js
REST API
Frontend
React (Vite)
HTML5, CSS3, JavaScript
Database
SQLite (local database)
Storage
Local file system (/uploads)


📁 Project Structure
project-root/

├── backend/
│   ├── auth.js
│   ├── data.js
│   ├── materials.js
│   └── server.js

├── frontend/
│   ├── src/
│   ├── index.html
│   └── vite.config.js

├── uploads/
├── rimtify.sqlite
└── README.md


⚙️ Installation & Setup
1. Clone Repository
git clone https://github.com/preeti-kaur245/Rimtify
cd rimtify-project-rimt
2. Backend Setup
cd backend
npm install
node server.js
3. Frontend Setup
cd frontend
npm install
npm run dev


🔌 API Overview
Auth Routes
POST /login → Login faculty
POST /register → Register faculty
Student & Attendance
GET /students → Get students
POST /students → Add student
GET /attendance → Get attendance
POST /attendance → Mark attendance
Materials
POST /upload → Upload file
GET /materials → Get uploaded files
💾 Database
SQLite database (rimtify.sqlite)
Stores:
Faculty credentials
Student records
Attendance data
Material metadata


🎯 Use Cases
Replace manual attendance registers
Manage student records digitally
Store and share study materials
Maintain organized academic data


⚠️ Limitations
Not scalable for production (SQLite + local storage)
Basic authentication (no JWT)
No role-based access control
UI can be improved


🔧 Future Improvements
Add JWT authentication
Use cloud database (PostgreSQL / Supabase)
Integrate cloud storage (AWS S3 / Firebase)
Add admin roles and dashboards
Improve UI/UX

👤 AUTHOR 
Manpreet Kaur
BCA AI/ML – RIMT University

📄 License
MIT License-2026 
