# ARKIVE — E-commerce Product Page

A full-stack e-commerce product page built with React + Node.js + Express + MongoDB.

## Tech Stack
- **Frontend:** React 18, Vite, CSS Modules, Axios
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)

## Features
- Product listing from MongoDB via REST API
- Color & size selection
- Add to cart with quantity control
- Persistent cart drawer (session-based)
- Seed endpoint to populate demo products

## Local Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI in .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

### Seed the database
After backend is running, visit:
```
POST http://localhost:5000/api/products/seed
```
Or use Thunder Client / Postman.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get single product |
| POST | /api/products/seed | Seed demo products |
| GET | /api/cart/:sessionId | Get cart |
| POST | /api/cart | Add item to cart |
| PATCH | /api/cart/:itemId | Update quantity |
| DELETE | /api/cart/:itemId | Remove item |

## Deployment
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas
