RIMTIFY-"RIMT Faculty Management System"
A full-stack web application built to simplify faculty workflows inside a university environment. This system allows teachers to manage attendance, upload study materials, create notes, and maintain structured student records based on courses.
____________________________

MAIN ACCESS: https://preeti-kaur245.github.io/Rimtify/
DOWNLOAD APK ANDROID: https://median.co/share/nmjnmkq#apk

____________________________
#Features
- Faculty Authentication (Login/Register)
- Attendance Management System
- Upload & Manage Study Materials
- Create and Save Notes
- Course-wise Student Data Management
- File Storage for Faculty Uploads
- Lightweight Local Database (SQLite)

# Tech Stack
### Backend
- Node.js
- Express.js
- REST API Architecture

### Frontend
- React (Vite)
- HTML5
- CSS3
- JavaScript

### Database
- SQLite (Local Database)

# Project Structure

```
project-root/

├── backend/
│   ├── auth.js        # Authentication APIs (login/register)
│   ├── data.js        # Student & course data handling
│   ├── materials.js   # Material upload & retrieval APIs
│   └── server.js      # Main Express server

├── frontend/
│   ├── src/
│   ├── index.html
│   └── vite.config.js

├── uploads/           # Stores uploaded faculty files

├── rimtify.sqlite     # SQLite database file

└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/preeti-kaur245/Rimtify
cd rimtify-project-rimt
```

### 2. Backend Setup
```bash
cd backend
npm install
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 API Overview

### Auth Routes (`auth.js`)
- POST `/login` → Authenticate faculty
- POST `/register` → Create new faculty account

### Data Routes (`data.js`)
- GET `/students` → Fetch student list
- POST `/students` → Add new student
- GET `/attendance` → View attendance
- POST `/attendance` → Mark attendance

### Materials Routes (`materials.js`)
- POST `/upload` → Upload files
- GET `/materials` → Retrieve uploaded materials

---

## 💾 Database

- Uses SQLite for simplicity and local storage.
- File: `rimtify.sqlite`
- Stores:
  - Faculty credentials
  - Student records
  - Attendance data
  - Uploaded material metadata

---

## 📌 Use Case

- University faculty to reduce manual work
- Easy digital record management
- Organized course-wise student tracking
- Centralized academic resource sharing

---

## ⚠️ Limitations

- Not scalable for production (SQLite + local uploads)
- Basic authentication (no advanced security)
- No role-based access control
- UI may need improvements

---

## 🔧 Future Improvements

- Add JWT authentication
- Use cloud storage (AWS S3 / Firebase)
- Upgrade database (PostgreSQL / MongoDB)
- Add admin roles
- Improve UI/UX
- Deploy the application

---
## 📄 License
This project is open-source and available under the MIT License.

## 👤 Author
Developed by MANPREET KAUR- BCA AI/ML (RIMT University)

