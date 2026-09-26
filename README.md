# YatraLink - Modern Bus Booking Platform

YatraLink is a comprehensive, modern bus ticket booking application featuring a beautiful user interface, seamless user experience, and a robust backend. 

## 🚀 Features

- **Sleek & Modern UI:** Designed with premium aesthetics, smooth animations, and a responsive layout for all devices.
- **Search & Book Buses:** Easy-to-use search functionality with origin, destination, and travel date inputs.
- **Seat Selection:** Interactive seat layout for choosing the exact seat you want.
- **User Authentication:** Secure login and registration for managing bookings and profiles.
- **Operator & Admin Dashboards:** Dedicated portals for bus operators to manage routes and for admins to oversee platform operations.
- **Offers & Coupons:** Integrated discount system for passengers.

## 🛠 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS (or Custom CSS), Lucide React (Icons)
- **Backend:** Node.js, Express.js
- **Database:** SQLite (Default for development) / PostgreSQL
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
*(Make sure to update the environment variables as needed, such as database credentials and JWT secrets).*

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
