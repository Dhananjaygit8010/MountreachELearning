# E-Learning & Industrial Internship Platform

A full-stack, enterprise-grade MERN platform featuring certified academic courses, interactive student progress tracking, verifiable digital certificate generation, and an industrial internship application hub.

---

## 🏗️ Project Architecture

```
E_Learning_Platform/
├── backend/                  # Modular Clean MVC Node.js & Express API
│   ├── src/
│   │   ├── config/           # Resilient DB connection with Atlas & offline fallbacks
│   │   ├── controllers/      # Auth, Courses, Internships business logic
│   │   ├── middlewares/      # JWT auth, express-validator handler, error handler
│   │   ├── models/           # Mongoose schemas (User, Course, Internship, Application)
│   │   ├── routes/           # RESTful route declarations
│   │   ├── utils/            # JWT signing, password hashing
│   │   ├── validators/       # Request validation rules
│   │   └── app.js            # Express app configuration
│   ├── seed/                 # Pre-populated accredited courses & internships
│   ├── server.js             # Server entry point with auto-seeding
│   ├── .env.example          # Environment variables template
│   └── package.json
│
└── frontend/                 # React 18 + Vite + Tailwind CSS Single Page App
    ├── src/
    │   ├── assets/           # Media and illustrations
    │   ├── components/       # Modals, Navbar, Footer, Toast notifications
    │   ├── context/          # AuthContext managing user sessions and enrollments
    │   ├── pages/            # Landing, Catalog, Details, Dashboard, Internships, Auth
    │   └── utils/            # Configurable Axios API client
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## ⚡ Quick Start

### 1. Start the Backend

```bash
cd backend
npm install
npm run seed     # (Optional) Seed the database with courses & internships
npm run dev      # Starts server on http://localhost:5000
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Key Features

- **🔐 Dual-Mode Secure Authentication**: Password hashing via Mongoose pre-save hook, JWT bearer tokens, and secure httpOnly cookies.
- **📚 Verified Courses Curriculum**: 7 full-scale industry programs across AI/ML, MERN Stack, Android Kotlin, Cyber Security, Flutter, Data Analytics, and Full Stack.
- **🎓 Interactive Student Dashboard**: Track coursework completion with simulated progress, unlock credentials, and preview/print ISO-stamped verifiable certificates with QR/Credential IDs.
- **💼 Industrial Internship Portal**: Browse corporate internships with stipends, apply with academic details and resume attachments, and track real-time application statuses.
- **🛡️ Rock-Solid Resilience**: Automatic DNS SRV fixes for Windows MongoDB Atlas connections, input validation with `express-validator`, and offline MongoDB Memory Server fallback.
