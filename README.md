# Admin Inventory Management System

A comprehensive inventory and employee management system built with the PERN/MERN stack (React, Node.js, Express, MySQL) and Dockerized for easy deployment.

## 🚀 Features

*   **Dashboard**: Real-time overview of inventory stats (Total Devices, Assigned, Warranties Expiring, Employee Count) and recent activity logs.
*   **Inventory Management**:
    *   Track Devices (Laptops, Desktops, Mobiles, etc.).
    *   Assign/Unassign devices to employees.
    *   Monitor warranty expiry dates.
    *   Manage device status (Available, Assigned, Retired, In Repair).
*   **Employee Management**:
    *   Maintain detailed employee records.
    *   Track device assignment history per employee.
    *   Vertical/Department-based organization.
*   **User Management**:
    *   Role-based access control (Super Admin, Admin, Employee).
    *   Secure authentication.
*   **Audit Logs**: detailed history of all system actions for accountability.
*   **Docker Support**: Containerized application for consistent deployment environments.

## 🛠 Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Axios, React Router.
*   **Backend**: Node.js, Express.js, Sequelize ORM.
*   **Database**: MySQL.
*   **Containerization**: Docker, Docker Compose.

---

## 🔧 Installation & Setup

### Prerequisites

*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
*   **(Optional for manual setup)**: Node.js (v18+) and MySQL installed locally.

### Option 1: Quick Start with Docker (Recommended)

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd inventory2
    ```

2.  **Start the application**:
    ```bash
    docker-compose up --build
    ```
    *   This will start the **Frontend** (port 5173), **Backend** (port 3001), and **MySQL Database** (port 3307).

3.  **Access the App**:
    *   Open your browser and go to: `http://localhost:5173`

4.  **Default Login**:
    *   **Username**: `admin`
    *   **Password**: `password123` (or as configured in your seed script).

---

### Option 2: Manual Local Setup

If you prefer to run without Docker, follow these steps.

#### 1. Database Setup
*   Ensure MySQL is running.
*   Create a database named `tanuh_inventory` (or update `.env` to match your DB name).

#### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` folder:
    ```env
    PORT=3001
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=your_mysql_password
    DB_NAME=tanuh_inventory
    SESSION_SECRET=your_secret_key
    FRONTEND_URL=http://localhost:5173
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

#### 3. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file (if needed by your configuration, though Vite picks up defaults):
    ```env
    VITE_API_URL=http://localhost:3001/api
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
5.  Access the app at `http://localhost:5173`.

---

## 📂 Project Structure

```
inventory2/
├── backend/                # Node.js/Express API
│   ├── config/             # DB configuration
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth & validation
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   └── server.js           # Entry point
│
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application views
│   │   ├── context/        # Global state (Auth)
│   │   └── lib/            # Utilities (Axios, etc.)
│   └── vite.config.js
│
└── docker-compose.yml      # Docker orchestration
```

## 🛡 API Documentation

The backend exposes RESTful APIs for resource management. Code follows standard MVC architecture.
*   `GET /api/dashboard/stats`: Dashboard metrics.
*   `GET /api/devices`: Inventory list.
*   `GET /api/employees`: Employee directory.
*   `POST /api/auth/login`: User authentication.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
