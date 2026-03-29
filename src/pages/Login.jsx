import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockVoters, mockAdmin } from '../utils/mockData';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'voter' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    if (form.role === 'admin') {
      if (form.email === mockAdmin.email && form.password === mockAdmin.password) {
        login({ ...mockAdmin, role: 'admin' });
        navigate('/admin');
      } else {
        setError('Invalid admin credentials.');
      }
    } else {
      const voter = mockVoters.find(v => v.email === form.email && v.password === form.password);
      if (voter) {
        login({ ...voter, role: 'voter' });
        navigate('/dashboard');
      } else {
        setError('Invalid email or password.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-brand">
            <span className="brand-dot" style={{ width: 32, height: 32, borderRadius: 10 }} />
            CampusVote
          </div>
          <h1 className="auth-headline">Your campus.<br />Your voice.</h1>
          <p className="auth-desc">Secure, transparent elections for CHRIST University students and administrators.</p>
          <div className="auth-stats">
            <div className="auth-stat"><span className="stat-num">5</span><span className="stat-label">Active Elections</span></div>
            <div className="auth-stat"><span className="stat-num">1.2k</span><span className="stat-label">Registered Voters</span></div>
            <div className="auth-stat"><span className="stat-num">100%</span><span className="stat-label">Secure Voting</span></div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-sub">Sign in to your account</p>

          <div className="role-toggle">
            <button className={`role-btn ${form.role === 'voter' ? 'active' : ''}`} onClick={() => setForm({ ...form, role: 'voter' })}>Voter</button>
            <button className={`role-btn ${form.role === 'admin' ? 'active' : ''}`} onClick={() => setForm({ ...form, role: 'admin' })}>Admin</button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@christuniversity.in" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="auth-footer">Don't have an account? <Link to="/register">Register here</Link></p>

          <div className="demo-hint">
            <p>Demo — Voter: <code>rewa@christuniversity.in</code> / <code>voter123</code></p>
            <p>Admin: <code>admin@christuniversity.in</code> / <code>admin123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
