import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockVoters } from '../utils/mockData';
import './Auth.css';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return setError('Enter a valid 10-digit Indian mobile number.');
    if (mockVoters.find(v => v.email === form.email)) return setError('Email already registered.');
    if (mockVoters.find(v => v.mobile === form.mobile)) return setError('Mobile number already registered.');

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const newVoter = { voter_id: mockVoters.length + 1, name: form.name, email: form.email, mobile: form.mobile, password: form.password };
    mockVoters.push(newVoter);
    login({ ...newVoter, role: 'voter' });
    navigate('/dashboard');
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
          <h1 className="auth-headline">Join the<br />democratic<br />process.</h1>
          <p className="auth-desc">Register once and vote in all CHRIST University elections securely.</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-sub">Register as a voter</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label>University email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@christuniversity.in" required />
            </div>
            <div className="form-group">
              <label>Mobile number <span style={{ color: '#9ca3af', fontWeight: 400 }}>(must be unique)</span></label>
              <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit mobile number" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
              </div>
              <div className="form-group">
                <label>Confirm</label>
                <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="••••••••" required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="auth-footer">Already registered? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
