import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockElections, mockCandidates } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [elections, setElections] = useState(mockElections);
  const [newElection, setNewElection] = useState({ title: '', description: '', start_date: '', end_date: '', icon: '🗳️' });
  const [newCandidate, setNewCandidate] = useState({ name: '', party: '', bio: '', election_id: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [candidates, setCandidates] = useState({ ...mockCandidates });

  const icons = ['🗳️', '🎓', '🏛️', '🎭', '💻', '⚽', '🎨', '📚'];

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const handleCreateElection = (e) => {
    e.preventDefault();
    const id = elections.length + 1;
    const created = { ...newElection, election_id: id, status: 'upcoming', admin_id: user.admin_id };
    mockElections.push(created);
    setElections([...mockElections]);
    mockCandidates[id] = [];
    setCandidates({ ...mockCandidates });
    setNewElection({ title: '', description: '', start_date: '', end_date: '', icon: '🗳️' });
    flash('Election created successfully!');
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    const eid = parseInt(newCandidate.election_id);
    if (!mockCandidates[eid]) mockCandidates[eid] = [];
    const id = Object.values(mockCandidates).flat().length + 1;
    mockCandidates[eid].push({ ...newCandidate, candidate_id: id, election_id: eid, votes: 0 });
    setCandidates({ ...mockCandidates });
    setNewCandidate({ name: '', party: '', bio: '', election_id: '' });
    flash('Candidate added successfully!');
  };

  const totalVotes = Object.values(mockCandidates).flat().reduce((s, c) => s + c.votes, 0);
  const totalVoters = 1;

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
          { id: 'voters', label: 'Voters', icon: '⊙' },
        ].map(item => (
          <button key={item.id} className={`sidebar-btn ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}>
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
        <button className="sidebar-btn" style={{ marginTop: 'auto', color: 'var(--danger)' }} onClick={() => navigate('/login')}>
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
              <div className="stat-card"><p className="stat-label">Active Elections</p><p className="stat-val">{elections.filter(e => e.status === 'active').length}</p></div>
              <div className="stat-card"><p className="stat-label">Total Candidates</p><p className="stat-val">{Object.values(mockCandidates).flat().length}</p></div>
              <div className="stat-card"><p className="stat-label">Total Votes Cast</p><p className="stat-val">{totalVotes}</p></div>
            </div>
            <h2 className="section-title">All Elections</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Title</th><th>Status</th><th>Candidates</th><th>Start</th><th>End</th></tr></thead>
                <tbody>
                  {elections.map(e => (
                    <tr key={e.election_id}>
                      <td>{e.icon} {e.title}</td>
                      <td><span className={`badge badge-${e.status === 'active' ? 'open' : e.status === 'upcoming' ? 'upcoming' : 'closed'}`}>{e.status}</span></td>
                      <td>{mockCandidates[e.election_id]?.length || 0}</td>
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
                <thead><tr><th>Name</th><th>Party</th><th>Election</th><th>Votes</th></tr></thead>
                <tbody>
                  {Object.values(candidates).flat().map(c => (
                    <tr key={c.candidate_id}>
                      <td style={{ fontWeight: 500 }}>{c.name}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.party}</td>
                      <td style={{ fontSize: 13 }}>{elections.find(e => e.election_id === c.election_id)?.title}</td>
                      <td><span style={{ fontWeight: 600, color: 'var(--purple)' }}>{c.votes}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'voters' && (
          <div>
            <h1 className="admin-title">Registered Voters</h1>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Mobile</th></tr></thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td style={{ fontWeight: 500 }}>Rewa</td>
                    <td>rewa@christuniversity.in</td>
                    <td>9876543210</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
