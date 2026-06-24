import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/apiClient';
const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');

      if (response.data.role === 'admin') {
        setIsAdmin(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchUser();
}, []);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('nutriai_token');
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-4 max-w-7xl">
        <div>
          <Link to="/" className="text-xl font-semibold text-brand-700">
            HealthOS
          </Link>
        </div>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <Link to="/dashboard" className="rounded-full px-4 py-2 hover:bg-slate-100">Dashboard</Link>
          <Link to="/food-search" className="rounded-full px-4 py-2 hover:bg-slate-100">Food</Link>
          <Link to="/tracking" className="rounded-full px-4 py-2 hover:bg-slate-100">Tracking</Link>
          <Link to="/history" className="rounded-full px-4 py-2 hover:bg-slate-100">History</Link>
          <Link to="/coach" className="rounded-full px-4 py-2 hover:bg-slate-100">AI Coach</Link>
          <Link to="/profile" className="rounded-full px-4 py-2 hover:bg-slate-100">Profile</Link>
          <Link to="/progress-center" className="rounded-full px-4 py-2 hover:bg-slate-100" >Progress Center</Link>
          <Link to="/feedback" className="rounded-full px-4 py-2 hover:bg-slate-100" > Feedback </Link>
          {isAdmin && (
  <Link to="/admin" className="rounded-full px-4 py-2 hover:bg-slate-100"> Admin</Link>
)}
{isAdmin && (
  <Link
    to="/admin-feedback"
    className="rounded-full px-4 py-2 hover:bg-slate-100"
  >
    Feedback
  </Link>
)}
          <button
            onClick={handleLogout}
            className="rounded-full bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
