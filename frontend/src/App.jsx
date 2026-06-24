import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import FoodSearchPage from './pages/FoodSearchPage';
import TrackingPage from './pages/TrackingPage';
import CoachPage from './pages/CoachPage';
import HistoryPage from './pages/HistoryPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import ProgressCenterPage from './pages/ProgressCenterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import FeedbackPage from './pages/FeedbackPage';
import AdminFeedbackPage from './pages/AdminFeedbackPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Routes>
       <Route path="/" element={<LandingPage />}/>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
     <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>

  <Route
    path="/dashboard"
    element={<DashboardPage />}
  />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="food-search" element={<FoodSearchPage />} />
        <Route path="tracking" element={<TrackingPage />} />
        <Route path="coach" element={<CoachPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="/progress-center" element={<ProgressCenterPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
     
      <Route
  path="/feedback"
  element={<FeedbackPage />}
/>
<Route
  path="/admin-feedback"
  element={
    <AdminFeedbackPage />
  }
/>
    </Routes>
  );
}

export default App;
