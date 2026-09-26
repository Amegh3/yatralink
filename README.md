# YatraLink - Intentionally Vulnerable Bus Booking Platform

**⚠️ DISCLAIMER: This application is intentionally vulnerable and designed specifically for security testing, educational purposes. Do NOT use this codebase in a production environment.**

YatraLink is a modern bus ticket booking application built to simulate a real-world platform while containing various security flaws and vulnerabilities. It serves as a training ground for security researchers, penetration testers, and developers to practice identifying and exploiting web application vulnerabilities in a safe, controlled environment.

## 🚀 Features & Scope

- **Simulated Real-World App:** Features a complete frontend (React) and backend (Node.js/Express) architecture resembling a production booking platform.
- **Security Testing Playground:** Contains intentional vulnerabilities for practicing penetration testing and secure code review.
- **CTF Integration:** Includes built-in CTF challenges, dashboards, and flags hidden throughout the application.
- **Standard Booking Flow:** Search for buses, select seats, manage user profiles, and view operator/admin portals.

## 🛠 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS (or Custom CSS)
- **Backend:** Node.js, Express.js
- **Database:** SQLite (Default for development)
- **Authentication:** JWT (JSON Web Tokens)

## 📦 Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/Amegh3/yatralink.git
cd yatralink
```

### 2. Setup the Backend
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on the provided `.env.example`:
```bash
cp .env.example .env
```
*(Leave the default insecure configurations as they are intended for the challenges).*

Start the backend server:
```bash
npm run dev
```
*The server typically runs on `http://localhost:5000`.*

### 3. Setup the Frontend
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
*The app will be accessible at `http://localhost:5173`.*

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
