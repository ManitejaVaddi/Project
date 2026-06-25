#  HealthOS

HealthOS is a full-stack AI-powered nutrition and fitness tracking web application that helps users monitor their daily health, track meals, water intake, exercise, weight, and receive personalized AI health suggestions.

## 🚀 Features

- User Authentication (Login/Register)
- Dashboard with Health Score
- Food & Nutrition Tracking
- Water Intake Tracking
- Exercise Tracking
- Weight Tracking
- Progress Center
- AI Health Coach
- User Feedback System
- Admin Feedback Management
- Interactive Charts & Analytics

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- React Query
- Axios
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt

### AI
- Google Gemini API

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🌐 Live Demo

Link: 
https://health-os-frontend-mu.vercel.app
