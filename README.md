# ⚙️ LawHive Backend

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-API-black?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-316192?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/JWT-Auth-orange?style=for-the-badge&logo=jsonwebtokens" />
  <img src="https://img.shields.io/badge/Stripe-Payment-635BFF?style=for-the-badge&logo=stripe" />
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge" />
</p>

---

## 📌 Project Overview

The LawHive Backend powers the full functionality of the LawHive platform.
It provides secure REST APIs for authentication, user management, lawyer scheduling, booking, and payment processing.

This backend is designed with scalability, security, and clean architecture in mind.

---

## 🔗 Live API

* 🌍 Base URL: https://assignment-5-backend-sepia.vercel.app/api/v1

---

## 🚀 Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* Role-based access control (Admin, Lawyer, User)
* Secure cookie/token handling

### 👤 User Management

* User registration & login
* Profile management

### ⚖️ Lawyer Management

* Create and manage lawyer profiles
* Define expertise/categories
* Manage availability and schedules

### 📅 Booking System

* Book appointments with lawyers
* Schedule-based booking logic
* Prevent double booking

### 🛠️ Admin Controls

* Manage lawyer categories
* Control system structure
* Manage users and lawyers

### 💳 Payment Integration

* Stripe payment processing
* Secure transaction handling

---

## 🧰 Technologies Used

### Backend

* **Node.js**
* **Express.js**

### Database & ORM

* **PostgreSQL**
* **Prisma ORM**

### Authentication

* **JWT (JSON Web Token)**

### Payment

* **Stripe**

### Deployment

* **Vercel**

---

## ⚙️ Setup Instructions

### 📥 Clone Repository

```bash id="b2x1lo"
git clone https://github.com/your-username/lawhive-backend.git
cd lawhive-backend
```

---

### 📦 Install Dependencies

```bash id="tq3xq7"
pnpm install
```

or

```bash id="t9i9yb"
bun install
```

---

### 🔑 Environment Variables

Create a `.env` file in the root directory:

```env id="0g3w64"
PORT=5000
DATABASE_URL=your_postgresql_database_url

JWT_ACCESS_SECRET=youraccesstokensecret
JWT_REFRESH_SECRET=yourrefreshtokensecret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

---

### 🗃️ Prisma Setup

```bash id="ck3m1o"
npx prisma generate
npx prisma migrate dev
```

---

### ▶️ Run Development Server

```bash id="4t94ha"
pnpm dev
```

or

```bash id="mxt6m2"
bun run dev
```

---

## 📁 Project Structure

```id="3z0n6j"
src/
│
├── app/
├── controllers/
├── services/
├── routes/
├── middlewares/
├── utils/
└── config/
```

---

## 🔐 Security

* JWT authentication with access & refresh tokens
* HTTP-only cookies support
* Role-based route protection
* Input validation & error handling

---

## 📡 API Structure (Example)

```id="a3n0lw"
/api/v1/auth
/api/v1/users
/api/v1/lawyers
/api/v1/schedules
/api/v1/bookings
/api/v1/payments
```

---

## 🚀 Deployment

* Backend deployed on **Vercel**
* Uses serverless functions

---

## 👨‍💻 Author

**Dipto Roy**

---

## ⭐ Support

If you find this project useful, give it a ⭐ on GitHub!
