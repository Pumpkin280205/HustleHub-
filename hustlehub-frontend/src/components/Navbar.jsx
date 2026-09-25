import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">HustleHub+</Link>
      {user ? (
        <div className="nav-links">
          <Link to="/gigs">Browse gigs</Link>
          <Link to="/bookings">My bookings</Link>
          {user.role === 'freelancer' && <Link to="/dashboard">Dashboard</Link>}
          <span className="nav-user">{user.email} ({user.role})</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      ) : (
        <div className="nav-links">
          <Link to="/login">Log in</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
}
