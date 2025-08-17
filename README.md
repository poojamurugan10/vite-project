.

🛍️ MERN E-Commerce App

This project is a full-stack e-commerce application built with:

Frontend: React.js, Axios, Tailwind CSS

Backend: Node.js, Express.js, MongoDB

Authentication: JWT (JSON Web Token)

Payment Integration: Razorpay

Email Notifications: Nodemailer (Gmail SMTP)

🚀 Features

✅ User Authentication (JWT)
✅ Add to Cart / Remove from Cart
✅ Place Order from Cart
✅ Razorpay Payment Gateway Integration
✅ Order History (My Orders)
✅ Cancel Orders (only if not Paid)
✅ Order Confirmation Email via Nodemailer
✅ Admin Panel (Optional: can be added for product management)

📂 Project Structure
ecom-app/
│
├── backend/         # Node.js + Express + MongoDB
│   ├── Controllers/ # orderController.js, productController.js, etc.
│   ├── Middleware/  # authMiddleware.js
│   ├── Models/      # User.js, Order.js, Product.js, Cart.js
│   ├── Routes/      # orderRoute.js, authRoute.js, paymentRoute.js
│   ├── utils/       # mailer.js
│   ├── server.js    # Entry point
│   └── .env         # Environment variables
│
├── frontend/        # React.js
│   ├── src/
│   │   ├── components/
│   │   ├── pages/   # Order.jsx, Cart.jsx, etc.
│   │   ├── Context/ # AuthContext.js
│   │   └── App.js
│   └── package.json
│
└── README.md
