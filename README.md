# CourseMaster
## Live link: https://course-master-client-m2ka.vercel.app/

A full-featured, production-ready E-learning platform built using **Next.js**, **Node.js (Express.js)**, and **MongoDB Atlas** following a modular architecture. This project simulates a real-world EdTech platform that supports students, instructors, and administrators with features such as course browsing, purchasing, learning management, and administrative operations.

---

## 🚀 Project Description

**CourseMaster** is designed and developed to replicate the workflow and architecture of modern E-learning systems. The platform ensures:

* High scalability and reliability
* Secure user authentication
* Efficient backend APIs
* Clean, modular Express.js architecture
* Seamless frontend experience using Next.js

### 🎯 **Key Objectives**

* Build an E-learning system where:

  * **Students** can browse, purchase, and consume courses.
  * **Administrators** can manage courses, track enrollments, and review assignments.
* Support production-level organization, including:

  * Modular backend structure
  * Versioned and secure APIs
  * Structured database schema
  * Performance and maintainability

---

## 📁 Project Structure (High-Level)

```
Backend/
├── src/           # Express.js modular backend
    ├── helpers/
    ├── modules--|
    |            |--routes.js
    |            |--controllers.js
    |            |--services.js
    ├── models/
    ├── middlewares/
    ├── utils/
    └── server.js
frontend
|__ 
   |-- public
   |--src          # Next.js frontend application
     ├── app/
     ├── components/
     ├── utils/
     
```

---

## 🛠️ Installation & Setup Guide


### 📌 **1. Clone Repo & Install Dependencies**

#### Backend

```bash
https://github.com/mahbub-alam-dave/course-master-server
npm install
```

#### Frontend

```bash
https://github.com/mahbub-alam-dave/course-master-client
npm install
```

### 📌 **3. Environment Variables**

Create a `.env` file in the **backend** folder with the following keys:

```
PORT=5000
DB_USER=database user
DB_PASS=database password
JWT_SECRET=your_jwt_secret_key
GITHUB_CLIENT_ID=github_client_id
GITHUB_CLIENT_SECRET=github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=stripe_secret_key
```

Create a `.env.local` file in **frontend**:

```
NEXT_PUBLIC_API=backend_url
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=stripe_public_key
```

### 📌 **4. Run the Project**

#### Backend

```bash
cd backend
npm run dev
```

#### Frontend

```bash
cd frontend
npm run dev
```

---

## 🔐 Authentication Module

* Email/Password registration & login
* JWT-based authentication
* Secure cookies for sessions

---

## 📘 API Documentation

### Base URL

```
/api/
```

### 🔹 **Auth APIs**

#### **POST /auth/register**

Registers a new user.

* **Body:** `{ name, email, password }`
* **Response:** User info + token

#### **POST /auth/login**

Logs in a user.

* **Body:** `{ email, password }`
* **Response:** User info + token

* **Body:** `{ token }`

---

### 🔹 **Course APIs**

#### **GET /courses**

Fetch all published courses.

#### **GET /courses/:id**

Fetch details of a single course.

#### **POST /courses** *(Admin Only)* (not implemented)

Create a new course.

* **Body:** `{ title, description, price, category, thumbnail }`

#### **PATCH /courses/:id** *(Admin Only)*

Update course details.

#### **DELETE /courses/:id** *(Admin Only)* 

Delete a course.

---

### 🔹 **Enrollment APIs**

#### **POST /enrollment/:courseId**

Enroll a user into a course.

#### **GET /my-courses**

Fetch all courses a user is enrolled in.

---

### 🔹 **Admin APIs** (not implemented)

* Manage users
* Manage enrollments
* Review assignments

---

## 📦 Technologies Used

### Frontend

* Next.js
* React.js
* Tailwind CSS
* NextAuth

### Backend

* Express.js
* MongoDB (Atlas)
* JWT Auth

### Dev Tools

* Postman
* Git & GitHub
* Nodemon
* ESLint & Prettier

---

## 🏁 Conclusion

CourseMaster is designed as a production-ready, scalable E-learning system with clean architecture, structured APIs, and modern full-stack technologies. It demonstrates your ability to build real-world EdTech platforms that serve thousands of users efficiently.

---

## ✨ Author

**Mahbub Alam**
