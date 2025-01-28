# Paid APIs Project

This is a **Full-Stack Application** that allows users to interact with premium APIs. The project consists of a **React.js** frontend and a **Node.js** backend, with **PostgreSQL** as the database. The application is built using modern web technologies and follows best practices for scalability, maintainability, and performance.

---

## 🚀 Features

### Frontend:
- **TypeScript**: Ensures type safety and reduces runtime errors.
- **React.js**: Component-based UI development.
- **RTK Query**: For data fetching and caching.
- **React-Hook-Form**: Simplifies form management.
- **Yup**: Schema-based validation for forms.
- **Material-UI**: Pre-built, customizable React UI components.
- **Skeletons**: Enhances user experience with loading states.

### Backend:
- **Node.js**: Handles server-side logic and API routing.
- **TypeScript**: Provides type safety and better code maintainability.
- **Express.js**: Lightweight, fast, and flexible web framework.
- **PostgreSQL**: A reliable and scalable relational database.
- **TypeORM**: Object-Relational Mapping for seamless database management.
- **JWT Authentication**: Secures user access with token-based authentication.
- **Async Handler**: Handles asynchronous operations efficiently.
- **dotenv**: Manages environment variables securely.

---

## 📦 Tech Stack

| Part        | Technology                                         |
|-------------|----------------------------------------------------|
| **Frontend**| TypeScript, React.js, RTK Query, Material-UI       |
| **Backend** | TypeScript, Node.js, Express.js, TypeORM, JWT      |
| **Database**| PostgreSQL                                         |

---

## 🛠️ Installation and Setup

### Prerequisites:
- Node.js and npm installed
- PostgreSQL database setup

### 1. Clone the Repository:
```bash
git clone https://github.com/Rajveer75way/paid-apis.git
cd paid-apis
```

---

### 2. Frontend Setup:

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run at `http://localhost:5173`.

---

### 3. Backend Setup:

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory and configure:
   ```env
   PORT=5000
   DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<database>
   JWT_SECRET=<your_jwt_secret>
   ```

4. Run database migrations:
   ```bash
   npm run typeorm migration:run
   ```

5. Start the server:
   ```bash
   npm run local
   ```

The backend will run at `http://localhost:5000`.

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Rajveer75way/paid-apis/issues).

---

## 📧 Contact

Rajveer Singh - [Portfolio](https://rajveersidhu.vercel.app/)  
GitHub: [@Rajveer75way](https://github.com/Rajveer75way)
