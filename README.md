# 🌾 KisanSetu

**Smart Mandi Procurement, Queue Management, and Notification Platform**

KisanSetu is a smart agricultural procurement platform designed for farmers, procurement officers, and district administrators. It simplifies mandi appointment booking, digital queue management, gate check-in, weighment, procurement records, Minimum Support Price (MSP) calculations, and notifications.

The application uses a React frontend, a Node.js and Express backend, MongoDB for persistent data storage, JWT for authentication, and optional Firebase Cloud Messaging (FCM) for browser push notifications.

## 🚀 Features

- 👨‍🌾 Farmer registration and login
- 🔐 Secure authentication with JWT and bcrypt password hashing
- 👥 Role-based access for Admin, Procurement Officer (Staff), and Farmer
- 📅 Mandi procurement appointment booking
- 🎟️ Digital queue token management
- 📍 State, District, Taluk/Tehsil, Village, and Mandi selection
- 🏢 APMC mandi management
- 🌱 Crop and MSP rate management
- 🚛 Vehicle registration and gate check-in
- ⚖️ Gross weight, tare weight, and net weight recording
- 📋 Procurement records and booking status tracking
- 💰 Procurement amount calculations
- 🔔 In-app notifications and optional Firebase push notifications
- 📊 Admin dashboard and procurement statistics
- 📈 Reports and procurement history
- 🛡️ Backend API authorization and data validation

## 🛠️ Technology Stack

**Frontend**
- React 19
- Vite 8
- JavaScript, HTML, and CSS

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- MongoDB
- Mongoose

**Authentication and Notifications**
- JSON Web Tokens (JWT)
- bcrypt password hashing
- Firebase Cloud Messaging (FCM)
- Firebase Admin SDK

## 📁 Project Structure

```text
KisanSetu/
├── public/
│   └── firebase-messaging-sw.js
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── assets/
│   └── App.jsx
├── server/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── controllers/
│   │   └── config/
│   ├── .env.example
│   └── package.json
├── .env.example
├── package.json
└── README.md
```

*Note: The structure above is illustrative. Actual folders and filenames may differ depending on the existing implementation.*

## 📋 Prerequisites

Install the following before running the project:

- Node.js 18 or later (Node.js 20 LTS recommended)
- npm 9 or later
- MongoDB Community Server or MongoDB Atlas
- Git
- Firebase project for push notifications (optional)

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd KisanSetu
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual repository URL.

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Configure Backend Environment Variables

Create a `.env` file inside the `server` directory using `server/.env.example` as a reference.

Example configuration for local development:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/KisanSetu26
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

Replace placeholder values with your actual configuration. If using MongoDB Atlas, use your Atlas connection string instead of the local MongoDB URI.

### 5. Configure Frontend Environment Variables

Create a root `.env` file using `.env.example` as a reference.

```env
VITE_API_URL=/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_VAPID_KEY=
```

Populate the Firebase variables only if Firebase notifications are configured. Use the actual variable names expected by your application.

### 6. Start the Backend

Open a terminal:

```powershell
cd server
npm start
```

The backend should start on port `5000`, unless another port is configured.

### 7. Start the Frontend

Open a second terminal in the project root:

```powershell
npm run dev
```

Open the local URL displayed by Vite, normally:

http://localhost:5173

### 8. Check Backend Connectivity

If the health endpoint is implemented, open:

http://localhost:5000/api/health

Verify that the API is running and MongoDB is connected.

## 🗄️ MongoDB Database

KisanSetu uses MongoDB to store application data.

Expected data areas may include:

- **Users:** farmer, staff, and administrator accounts
- **Mandis:** APMC mandi details and supported locations
- **Crops:** crop names and varieties
- **MSP Rates:** crop prices and applicable seasons
- **Bookings:** appointment and queue information
- **Procurements:** weighment and procurement results
- **Notifications:** per-user notification history
- **Payments:** payment details and transaction status, if implemented

Actual collection names depend on the Mongoose models and configuration in the project.

## 🔐 Authentication and Authorization

KisanSetu uses JWT-based authentication and bcrypt password hashing.

The intended roles are:

- **Farmer:** register, log in, book procurement slots, and view personal bookings and notifications
- **Procurement Officer (Staff):** manage assigned bookings, check-in, weighment, and procurement records
- **Admin:** manage users, roles, mandis, crops, MSP rates, bookings, and reports

Public registration should create farmer accounts only. Administrative roles must be assigned through a secure, authorized process.

Private API routes must validate the JWT and enforce permissions on the backend.

## 📍 Location and Mandi Management

The booking workflow follows this location hierarchy:

**State → District → Taluk/Tehsil → Mandi**

The application should use verified administrative location data and show only the districts and taluks associated with the selected parent location.

Administrators should be able to configure available APMC mandis, their addresses, supported crops, and operating details.

Location and mandi coverage depends on the data source and configuration used by the application.

## 🌾 Procurement Workflow

1. The farmer registers or logs in.
2. The farmer selects a state, district, taluk, and mandi.
3. The farmer selects a crop, quantity, vehicle, preferred date, and available time slot.
4. The system creates a booking and assigns a booking reference or queue token according to the configured workflow.
5. An authorized administrator or procurement officer reviews and approves the booking.
6. The farmer arrives at the mandi and completes gate check-in.
7. The procurement officer records weighment and quality details.
8. The system calculates the accepted quantity and procurement amount using the applicable rate.
9. The procurement record and booking status are saved in MongoDB.
10. The farmer receives an in-app notification and, when configured, a Firebase push notification.

## 🔔 Firebase Cloud Messaging

Firebase Cloud Messaging is optional. In-app notifications can operate through MongoDB without Firebase credentials if the application implements that functionality.

To enable browser push notifications:

1. Create or select a project in the Firebase Console.
2. Configure a Firebase Web App.
3. Enable Firebase Cloud Messaging.
4. Configure the web push VAPID key.
5. Add the public Firebase Web configuration to the frontend environment.
6. Configure Firebase Admin SDK credentials on the backend.
7. Register the service worker and request browser notification permission.
8. Associate each device token with the authenticated user.
9. Test notification delivery using the actual application workflow.

The backend should save notification history before attempting push delivery. Invalid or expired FCM tokens should be handled safely.

**Security:** Never expose Firebase Admin private keys, MongoDB passwords, or JWT signing secrets in frontend code or public repositories. Browser push notifications generally require HTTPS in deployed environments; localhost is permitted for development.

## 🔌 API Overview

The following table describes the intended API surface. Confirm each route and permission against the actual backend implementation.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a farmer |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/bookings` | Retrieve permitted bookings |
| POST | `/api/bookings` | Create a procurement booking |
| PATCH | `/api/bookings/:id/status` | Update booking status |
| POST | `/api/bookings/:id/procurement` | Save procurement and weighment details |
| GET | `/api/notifications` | Retrieve notification history |
| PATCH | `/api/notifications/:id/read` | Mark a notification as read |
| POST | `/api/devices` | Register an FCM device token |
| GET | `/api/mandis` | Retrieve mandi information |
| POST | `/api/mandis` | Create a mandi, subject to authorization |
| GET | `/api/crops` | Retrieve crop information |
| POST | `/api/crops` | Create a crop, subject to authorization |
| GET | `/api/users` | Retrieve users, subject to authorization |
| GET | `/api/dashboard` | Retrieve permitted dashboard statistics |

## 🧪 Testing and Validation

Build the frontend:

```bash
npm run build
```

Recommended end-to-end tests:

- Verify MongoDB connectivity.
- Register a farmer and test login.
- Verify unauthorized users cannot access admin routes.
- Create a booking and confirm it persists after refreshing the page.
- Test location dropdowns and mandi selection.
- Approve or reject a booking using an authorized account.
- Test gate check-in and weighment records.
- Verify procurement calculations and booking history.
- Confirm notification history and unread counts.
- Test Firebase push notifications if configured.
- Verify that the application handles invalid inputs and API errors correctly.

## 🔒 Security Best Practices

- Keep `.env` files out of Git.
- Use a strong, randomly generated JWT secret.
- Restrict MongoDB network access and database permissions.
- Validate inputs and permissions on the backend.
- Use HTTPS for production deployments.
- Avoid storing sensitive personal information unless necessary.
- Never commit passwords, tokens, or private keys.
- Back up important database records before maintenance operations.

## 🚀 Future Enhancements

Potential future improvements include:

- Live mandi queue displays
- SMS notifications and reminders
- Advanced procurement analytics
- Multilingual user interface
- Mobile-friendly farmer portal
- Downloadable procurement reports
- Improved offline support
- Additional integrations with verified agricultural data sources

## 📄 License

This project is licensed under the MIT License, provided that a corresponding `LICENSE` file is included in the repository.

---

## 👨‍💻 Developer

**Developed by Naveen C B**

KisanSetu — Smart Mandi Procurement, Queue Management, and Notification Platform.

Built with React, Node.js, Express, MongoDB, and Firebase Cloud Messaging.

---
