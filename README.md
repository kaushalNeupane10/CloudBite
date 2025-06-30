# 🍽️ CloudBite
![MIT License](https://img.shields.io/badge/license-MIT-blue)
![Build with Vite](https://img.shields.io/badge/built%20with-Vite-646CFF?logo=vite)
![Made with React](https://img.shields.io/badge/react-18.3.1-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-3.x-blue?logo=tailwind-css)
![Stripe](https://img.shields.io/badge/payments-stripe-blueviolet?logo=stripe)
CloudBite is a full-stack cloud kitchen application built using **React**, **Tailwind CSS**, **Django REST Framework**, and **Stripe** for secure payments.
It allows users to browse menu items, manage their cart, place orders, and view order history.

---

## 🔗 Live Demo

- **Frontend (React)**: [https://cloudbites.netlify.app](https://cloudbites.netlify.app)
- **Backend (Django)**: [https://cloudbite.onrender.com](https://cloudbite.onrender.com)

---

## 🚀 Features

- 🔐 Authentication: Secure login and registration using JWT :
    - Includes auto-refreshing tokens using refresh tokens for seamless user sessions.  
- 📦 Menu Browsing: View menu items with search functionality
- 🛒 Cart: Add/remove items with quantity management
- 💳 Stripe Integration: Secure checkout for single and multiple items
- 🧾 Order History: View past orders with itemized breakdowns
- 🛠️ Admin Dashboard (Planned Feature):
    - An admin dashboard will be implemented in the future to manage menu items, orders, and users through a custom interface.
    - For now, all administrative tasks are handled via the built-in Django Admin Panel.

---

## 🧑‍💻 Tech Stack

 💻 Frontend :
  - The frontend of the application is built using modern React tooling and libraries:
  - React.js – UI library for building interactive interfaces
  - Tailwind CSS – Utility-first CSS framework for styling
  - React Router DOM – Declarative routing for React apps
  - Axios – Promise-based HTTP client for making API calls
  - React Toastify – Elegant toast notifications
  - Heroicons (React) – Beautiful hand-crafted SVG icons
  - Lucide React – A collection of consistent, open-source icons
  - @stripe/stripe-js – Stripe.js library for securely handling Stripe Checkout
  - Built with Vite for fast development and optimized builds.

🧠 Backend :
    The backend is powered by Django and Django REST Framework, providing a robust and scalable API:
    - Django + Django REST Framework – Backend framework and API layer
    - Simple JWT – JSON Web Token-based authentication system
    - Stripe API – Secure payment processing integration
    - Cloudinary (optional) – Cloud-based image upload and storage solution
    The API is RESTful and follows best practices for authentication, payments, and media handling.

**Deployment:**
- Frontend: Netlify
- Backend: Render
- Stripe Webhooks for payment events

---

## ⚙️ Installation

### Prerequisites

- Node.js & npm – For running the frontend (React + Vite)
- Python 3.9+ – Required for the Django backend
- SQLite – Used as the default database (no setup needed):
  - You can switch to PostgreSQL later for production if needed
- Stripe Account – For handling payments (test keys required)
  
### Clone the repo

```bash
git clone https://github.com/your-username/cloudbite.git
cd cloudbite
```
# Backend SetUp

```bash
cd backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
```
### Create .env file in backend
  # Django Settings
    SECRET_KEY=your-django-secret-key
    DEBUG=True
    ALLOWED_HOSTS=localhost,127.0.0.1
  # Database (SQLite by default)
    DATABASE_URL=sqlite:///db.sqlite3
  # To use PostgreSQL or another DB in production:
  # DATABASE_URL=postgres://user:password@host:port/dbname
  
  # Stripe API Keys
    STRIPE_SECRET_KEY=your-stripe-secret-key
    STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
  # Cloudinary (Optional for image uploads)
    CLOUDINARY_CLOUD_NAME=your-cloud-name
    CLOUDINARY_API_KEY=your-cloudinary-api-key
    CLOUDINARY_API_SECRET=your-cloudinary-api-secret
  # Frontend URL (for CORS and redirects)
    FRONTEND_URL=http://localhost:3000
    CORS_ALLOWED_ORIGINS=http://localhost:3000
 ```bash
    python manage.py migrate
    python manage.py runserver
 ```
### Frontend SetUp
   ```bash
      cd frontend
      npm install
   ```
 ### Create .env file in frontend/
     VITE_API_URL=http://localhost:8000/api
     VITE_STRIPE_PUBLIC_KEY=your-publishable-stripe-key
  ```bash
     npm run dev
  ```
🔐 Authentication
 - JWT-based auth using access/refresh tokens
 - Tokens stored in localStorage
 - Axios interceptors handle token refresh

📦 Stripe Setup
  1. Install Stripe CLI
     ```bash
     npm install -g stripe
     ```

  2.Production Webhook
  - Go to Stripe Dashboard → Developers → Webhooks
  - Add endpoint:
    ```bash
    https://your-backend.onrender.com/api/stripe-webhook/
    ```
  - Events: checkout.session.completed (optional: checkout.session.expired, payment_intent.*)
  - Copy the webhook secret and add it to .env as STRIPE_WEBHOOK_SECRET

  3.Local Webhook
  - Run:
    ```bash
    stripe login
    stripe listen --forward-to localhost:8000/api/stripe-webhook/
    ```
  - Add the generated secret to your local .env

📁 Folder Structure
   cloudbite/
├── backend/
│   ├── cloudbite/        # Django project settings
│   ├── core/             # Main Django app (models, views, API logic)
│   └── manage.py
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/   # Reusable React components
    │   ├── pages/        # Page-level components
    │   └── utils/        # Utility functions
    └── index.html
💬 Acknowledgements
  - Stripe – For payment integration
  - Django REST Framework – For building the API
  - React – For building the user interface
  - Tailwind CSS – For styling the application
  - Vite – For fast and optimized frontend development

## 📜 License

This project is licensed under the [MIT License](LICENSE).
