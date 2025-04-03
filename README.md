# Ecommerce Frontend

Fatih Ünal Kesik e2467520

This is the frontend for the E-Commerce Web Application built for the CENG495 Cloud Computing Assignment 1 at METU.

It is a client-side rendered app using HTML, CSS, and JavaScript. The app is deployed to Vercel and communicates with the backend via a RESTful API hosted on Render.

---

## Live Deployment

- **Frontend**: [https://ecommerce-frontend-theta-hazel.vercel.app](https://ecommerce-frontend-theta-hazel.vercel.app)
- **Backend**: [https://ecommerce-backend-x6ce.onrender.com](https://ecommerce-backend-x6ce.onrender.com)

---

## Technologies Used

- HTML5 + CSS3 + Vanilla JavaScript
- LocalStorage for auth tracking
- Hosted on Vercel (Frontend)
- API served from Render

---

## Users

There are two types of users:

### Admin
- Can add/delete **items**
- Can add/delete **users**
- Can see and browse **items and reviews**

### Regular User
- Can **browse items**
- Can **rate and review** items
- Can **edit their own ratings/reviews**

---

## Login Details (for demo)

You can use these credentials to test:

### Admin User
- **Username**: `admin`
- **Password**: `admin`

### Regular Users
- **Username**: `james_brown` | **Password**: `password`
- **Username**: `alice_smith` | **Password**: `abc123`
- **Username**: `mary_jones`  | **Password**: `qwerty`
- **Username**: `john_doe`    | **Password**: `02021999`

---

## Folder Structure
 index.html # Home page 
 admin.html # Admin dashboard 
 login.html # Login screen 
 user.html # User dashboard 
 *.js # JS for each page 
 *.css # Styling