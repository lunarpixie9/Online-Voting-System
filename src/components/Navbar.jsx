import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'} className="navbar-brand">
        CampusVote
      </Link>

      <div className="navbar-links">
        {user ? (
          <>
            {user.role === 'voter' && (
              <>
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Elections</Link>
                <Link to="/results" className={`nav-link ${isActive('/results') ? 'active' : ''}`}>Results</Link>
              </>
            )}
            {user.role === 'admin' && (
              <>
                <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>Dashboard</Link>
                <Link to="/admin/elections" className={`nav-link ${isActive('/admin/elections') ? 'active' : ''}`}>Elections</Link>
                <Link to="/admin/candidates" className={`nav-link ${isActive('/admin/candidates') ? 'active' : ''}`}>Candidates</Link>
              </>
            )}
            <div className="nav-user">
              <div className="nav-avatar">{user.name?.[0]?.toUpperCase()}</div>
              <span className="nav-name">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 13 }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/results" className="nav-link">Results</Link>
            <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
