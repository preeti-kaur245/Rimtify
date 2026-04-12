--RIMTIFY – Faculty Management System (Web + Android APK)--

RIMTIFY is a full-stack faculty productivity system designed to simplify academic workflows in universities. It allows teachers to manage attendance, student records, study materials, and notes with real-time syncing across devices.

🔗 Live App: https://preeti-kaur245.github.io/Rimtify/

📱 Download Android APK: https://median.co/share/nmjnmkq#apk

⚡ Features
🔐 Authentication (Supabase)
-Secure faculty login & registration
-Session management across devices
📊 Attendance Management
-Mark attendance per course
-Persistent cloud storage
-Real-time sync across devices
📅 Multi-Day Attendance Export
-Export attendance for last N days
-Fetch historical data from database
-Sorted and structured output
📥 CSV Report Generation
-Proper comma-separated format
-UTF-8 with BOM (Excel compatible)
-Handles special characters and commas
Clean column structure:
Date, Student Name, Student ID, Course, Attendance Status


📂 File Download
-Auto-download as: attendance_report.csv
-Works in Excel, Google Sheets, etc.
📁 Study Materials (Cloud Storage)
-Upload PDFs, images, files
-Stored securely using Supabase Storage
-Accessible across devices
📝 Notes System
-Create and save teaching notes
-Cloud-synced data
🎓 Student Management
-Course-wise student records
-Centralized database (Supabase)


🛠 Tech Stack
~Frontend
React (Vite)
HTML5, CSS3, JavaScript
~Backend / BaaS
Supabase
PostgreSQL Database
~Authentication
Storage
API Layer
Supabase client (REST + Realtime)


📁 Project Structure
project-root/

├── frontend/
│   ├── src/
│   ├── index.html
│   └── vite.config.js

├── supabase/
│   └── config (optional)

└── README.md


⚙️ Setup
1. Clone Repository
git clone https://github.com/preeti-kaur245/Rimtify
cd rimtify-project-rimt
2. Setup Environment Variables

Create a .env file inside frontend/:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
3. Run Frontend
cd frontend
npm install
npm run dev
🗄 Database (Supabase - PostgreSQL)


Stores:

Faculty authentication data
Student records
Attendance history
Notes
Material metadata
☁️ Storage
Supabase Storage buckets
Used for:
Study materials
Uploaded files
🎯 Use Cases
Replace manual attendance registers
Real-time faculty data sync across devices
Centralized academic resource management
Automated reporting for audits

⚠️ Current Limitations
Still not perfect. Be honest:
No advanced role-based access (Admin/Student)
Limited analytics/dashboard
UI can be improved
No payment system (not SaaS-ready yet)


🔧 Future Improvements
Add role-based access control (RBAC)
Admin dashboard for institutions
Analytics (attendance insights)
Payment integration (Razorpay/Stripe)
Multi-tenant architecture (per college)
Full deployment (custom domain + backend services)

👤 Author
Manpreet Kaur
BCA AI/ML – RIMT University

📄 License
MIT License
