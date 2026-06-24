# Trackify 💰 — Expense & Budget Tracker

> A full-stack MERN application to track expenses, manage budgets and gain financial clarity.

## 🗂️ Project Structure

```
Trackify/
├── client/                  # React (Vite) Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/          # Images, icons, fonts
│   │   ├── components/
│   │   │   ├── layout/      # Navbar, Footer
│   │   │   ├── common/      # Shared UI components
│   │   │   └── ui/          # Buttons, Cards, Modals
│   │   ├── pages/           # Home, Dashboard, Auth pages
│   │   ├── styles/          # Global CSS design tokens
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # React Context (auth, data)
│   │   ├── services/        # Axios API service layer
│   │   └── utils/           # Helper functions
│   ├── index.html
│   └── vite.config.js
│
└── server/                  # Node.js + Express Backend
    ├── config/              # DB connection, env config
    ├── controllers/         # Route handler logic
    ├── models/              # Mongoose schemas
    ├── routes/              # API route definitions
    ├── middleware/          # Auth, error handling
    └── server.js            # Entry point
```

## 🚀 Getting Started

### Client (Frontend)
```bash
cd client
npm install
npm run dev        # Runs on http://localhost:3000
```

### Server (Backend)
```bash
cd server
npm install
# Add your MONGO_URI to .env
npm run dev        # Runs on http://localhost:5000
```

## 🛠️ Tech Stack
- **Frontend:** React 18, Vite, React Router v6, Vanilla CSS
- **Backend:** Node.js, Express 4, Mongoose
- **Database:** MongoDB
- **Auth:** JWT + bcryptjs

## 📄 API Endpoints (Planned)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/expenses` | List expenses |
| POST | `/api/expenses` | Add expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/budgets` | List budgets |
| POST | `/api/budgets` | Create budget |
| PUT | `/api/budgets/:id` | Update budget |
| DELETE | `/api/budgets/:id` | Delete budget |
