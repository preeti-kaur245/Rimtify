# Rimtify – Faculty Portal

This folder (`rimtify project rimt`) contains the complete source code for the Rimtify Faculty Portal, featuring a secure backend with SQLite and a modern React frontend.

## Directory Structure
- `/backend` - Node.js Express server and API endpoints (`auth.js`, `data.js`, `materials.js`).
- `/frontend` - React Vite application containing all the UI screens, components, and styling.
- `/uploads` - Directory where faculty files are stored.
- `rimtify.sqlite` - Local SQLite database.
- `rimtify_original_prototype.html` - The original HTML prototype you provided.

## How to Run the Project

### 1. Start the Backend Server
1. Open a terminal inside the main folder (`rimtify project rimt`).
2. Run `npm install` (only needed the first time).
3. Run `npm run dev`.
4. The backend server will start on `http://localhost:5000`.

### 2. Start the Frontend App
1. Open a **second** terminal window.
2. Navigate to the frontend folder: `cd frontend`
3. Run `npm install` (only needed the first time).
4. Run `npm run dev`
5. The Vite server will start, and give you a link (usually `http://localhost:5173` or `http://localhost:3000`).
6. Click the link to open the app in your browser!
