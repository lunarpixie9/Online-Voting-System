import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './Admin.css';

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [newElection, setNewElection] = useState({ title: '', description: '', start_date: '', end_date: '', icon: '🗳️' });
  const [newCandidate, setNewCandidate] = useState({ name: '', party: '', bio: '', election_id: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const loadElections = () => {
    api.getElections().then(data => {
      if (data.success) setElections(data.elections);
    });
  };

  const loadCandidates = (election_id) => {
    api.getCandidates(election_id).then(data => {
      if (data.success) setCandidates(prev => [...prev.filter(c => c.election_id != election_id), ...data.candidates]);
    });
  };

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    elections.forEach(e => loadCandidates(e.election_id));
  }, [elections]);

  const totalVotes = candidates.reduce((s, c) => s + parseInt(c.votes || 0), 0);

  const handleCreateElection = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost/voting-backend/api/elections.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newElection, admin_id: user.admin_id }),
    });
    const data = await res.json();
    if (data.success) {
      flash('Election created!');
      setNewElection({ title: '', description: '', start_date: '', end_date: '', icon: '🗳️' });
      loadElections();
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost/voting-backend/api/candidates.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCandidate),
    });
    const data = await res.json();
    if (data.success) {
      flash('Candidate added!');
      setNewCandidate({ name: '', party: '', bio: '', election_id: '' });
      loadCandidates(newCandidate.election_id);
    }
  };

  const icons = ['🗳️', '🎓', '🏛️', '🎭', '💻', '⚽', '🎨', '📚'];

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-sidebar-top">
          <p className="sidebar-label">Admin Panel</p>
          <p className="sidebar-user">{user?.username || user?.name}</p>
        </div>
        {[
          { id: 'overview', label: 'Overview', icon: '◉' },
          { id: 'elections', label: 'Elections', icon: '⊞' },
          { id: 'candidates', label: 'Candidates', icon: '⊕' },
        ].map(item => (
          <button key={item.id} className={`sidebar-btn ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}>
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
        <button className="sidebar-btn" style={{ marginTop: 'auto', color: 'var(--danger)' }} onClick={() => { logout(); navigate('/login'); }}>
          <span>↩</span> Logout
        </button>
      </div>

      <div className="admin-content">
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {tab === 'overview' && (
          <div>
            <h1 className="admin-title">Overview</h1>
            <div className="stats-grid">
              <div className="stat-card"><p className="stat-label">Total Elections</p><p className="stat-val">{elections.length}</p></div>
              <div className="stat-card"><p className="stat-label">Active</p><p className="stat-val">{elections.filter(e => e.status === 'active').length}</p></div>
              <div className="stat-card"><p className="stat-label">Candidates</p><p className="stat-val">{candidates.length}</p></div>
              <div className="stat-card"><p className="stat-label">Votes Cast</p><p className="stat-val">{totalVotes}</p></div>
            </div>
            <h2 className="section-title">All Elections</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Title</th><th>Status</th><th>Start</th><th>End</th></tr></thead>
                <tbody>
                  {elections.map(e => (
                    <tr key={e.election_id}>
                      <td>🗳️ {e.title}</td>
                      <td><span className={`badge badge-${e.status === 'active' ? 'open' : e.status === 'upcoming' ? 'upcoming' : 'closed'}`}>{e.status}</span></td>
                      <td>{e.start_date}</td>
                      <td>{e.end_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'elections' && (
          <div>
            <h1 className="admin-title">Create Election</h1>
            <div className="admin-form-card">
              <form onSubmit={handleCreateElection}>
                <div className="form-group">
                  <label>Election title</label>
                  <input type="text" value={newElection.title} onChange={e => setNewElection({ ...newElection, title: e.target.value })} placeholder="e.g. Class Representative Election" required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={newElection.description} onChange={e => setNewElection({ ...newElection, description: e.target.value })} placeholder="Brief description..." rows={3} style={{ resize: 'vertical' }} />
                </div>
                <div className="form-group">
                  <label>Icon</label>
                  <div className="icon-picker">
                    {icons.map(ic => (
                      <button type="button" key={ic} className={`icon-btn ${newElection.icon === ic ? 'active' : ''}`} onClick={() => setNewElection({ ...newElection, icon: ic })}>{ic}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Start date</label>
                    <input type="date" value={newElection.start_date} onChange={e => setNewElection({ ...newElection, start_date: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>End date</label>
                    <input type="date" value={newElection.end_date} onChange={e => setNewElection({ ...newElection, end_date: e.target.value })} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Create Election</button>
              </form>
            </div>
          </div>
        )}

        {tab === 'candidates' && (
          <div>
            <h1 className="admin-title">Add Candidate</h1>
            <div className="admin-form-card">
              <form onSubmit={handleAddCandidate}>
                <div className="form-group">
                  <label>Election</label>
                  <select value={newCandidate.election_id} onChange={e => setNewCandidate({ ...newCandidate, election_id: e.target.value })} required>
                    <option value="">Select an election</option>
                    {elections.map(e => <option key={e.election_id} value={e.election_id}>{e.title}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Candidate name</label>
                  <input type="text" value={newCandidate.name} onChange={e => setNewCandidate({ ...newCandidate, name: e.target.value })} placeholder="Full name" required />
                </div>
                <div className="form-group">
                  <label>Party / Group</label>
                  <input type="text" value={newCandidate.party} onChange={e => setNewCandidate({ ...newCandidate, party: e.target.value })} placeholder="e.g. Progressive Alliance" />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea value={newCandidate.bio} onChange={e => setNewCandidate({ ...newCandidate, bio: e.target.value })} placeholder="Short bio..." rows={3} style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" className="btn btn-primary">Add Candidate</button>
              </form>
            </div>

            <h2 className="section-title" style={{ marginTop: '2rem' }}>All Candidates</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Party</th><th>Election</th></tr></thead>
                <tbody>
                  {candidates.map(c => (
                    <tr key={c.candidate_id}>
                      <td style={{ fontWeight: 500 }}>{c.name}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.party}</td>
                      <td style={{ fontSize: 13 }}>{elections.find(e => e.election_id == c.election_id)?.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}