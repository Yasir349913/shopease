# ShopEase 🛍️
### Web Technologies Semester Project — Assignment 3

A full-stack e-commerce web application built with **Node.js**, **Express.js**, **MongoDB**, and **EJS**.

---

## Features

- ✅ User Registration & Login (JWT authentication)
- ✅ Secure password hashing with **bcrypt**
- ✅ JWT tokens stored in HTTP-only cookies
- ✅ Protected routes with JWT middleware
- ✅ Role-based access (User / Admin)
- ✅ Full CRUD for Products (Admin only)
- ✅ Add to Cart / View Cart / Update Quantity / Remove Items
- ✅ Search & Filter products by category and price
- ✅ Flash messages for user feedback
- ✅ Responsive UI with EJS templates

---

## Tech Stack

| Layer      | Technology           |
|------------|----------------------|
| Runtime    | Node.js              |
| Framework  | Express.js           |
| Database   | MongoDB + Mongoose   |
| Templates  | EJS                  |
| Auth       | JWT + bcryptjs       |
| Styling    | Custom CSS           |

---

## Folder Structure

```
shopease/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js   # Register, Login, Logout
│   ├── productController.js # CRUD for Products
│   └── cartController.js   # Cart operations
├── middleware/
│   └── auth.js             # JWT protect + admin middleware
├── models/
│   ├── User.js             # User schema (with embedded cart)
│   └── Product.js          # Product schema
├── public/
│   └── css/
│       └── style.css       # Main stylesheet
├── routes/
│   ├── authRoutes.js       # /auth/*
│   ├── productRoutes.js    # /products/*
│   └── cartRoutes.js       # /cart/*
├── views/
│   ├── partials/
│   │   ├── header.ejs      # Navbar + flash messages
│   │   └── footer.ejs      # Footer + scripts
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── products/
│   │   ├── index.ejs       # Products listing
│   │   ├── show.ejs        # Product detail
│   │   └── form.ejs        # Add/Edit form
│   ├── cart/
│   │   └── index.ejs       # Cart page
│   ├── 404.ejs
│   └── error.ejs
├── app.js                  # Entry point
├── .env                    # Environment variables
└── package.json
```

---

## Setup & Run

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Edit `.env` file:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/shopease
JWT_SECRET=your_super_secret_key_here
SESSION_SECRET=your_session_secret_here
NODE_ENV=development
```

### 3. Start the server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

### 4. Open in browser
```
http://localhost:3000
```

---

## API Routes

### Auth
| Method | Route              | Description         | Access  |
|--------|--------------------|---------------------|---------|
| GET    | /auth/register     | Show register form  | Public  |
| POST   | /auth/register     | Create account      | Public  |
| GET    | /auth/login        | Show login form     | Public  |
| POST   | /auth/login        | Login user          | Public  |
| GET    | /auth/logout       | Logout user         | Private |

### Products (CRUD)
| Method | Route              | Description         | Access  |
|--------|--------------------|---------------------|---------|
| GET    | /products          | List all products   | Public  |
| GET    | /products/new      | Add product form    | Admin   |
| POST   | /products          | Create product      | Admin   |
| GET    | /products/:id      | View product        | Public  |
| GET    | /products/:id/edit | Edit product form   | Admin   |
| PUT    | /products/:id      | Update product      | Admin   |
| DELETE | /products/:id      | Delete product      | Admin   |

### Cart
| Method | Route                    | Description       | Access  |
|--------|--------------------------|-------------------|---------|
| GET    | /cart                    | View cart         | Private |
| POST   | /cart/add/:productId     | Add item          | Private |
| POST   | /cart/update/:productId  | Update quantity   | Private |
| POST   | /cart/remove/:productId  | Remove item       | Private |
| POST   | /cart/clear              | Clear all items   | Private |

---

## Making yourself Admin

Register normally, then in MongoDB:
```javascript
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

*Built for Web Technologies — Assignment 3*
