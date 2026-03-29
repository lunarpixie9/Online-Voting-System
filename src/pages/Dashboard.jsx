import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockElections, mockVotes } from '../utils/mockData';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? mockElections : mockElections.filter(e => e.status === filter);
  const userVotes = mockVotes[user?.voter_id] || {};

  const statusLabel = { active: 'Open', upcoming: 'Upcoming', closed: 'Closed' };
  const statusClass = { active: 'badge-open', upcoming: 'badge-upcoming', closed: 'badge-closed' };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Hello, {user?.name?.split(' ')[0]}! </h1>
          <p>Browse and vote in active CHRIST University elections.</p>
        </div>
        <div className="filter-tabs">
          {['all', 'active', 'upcoming', 'closed'].map(f => (
            <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : statusLabel[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="elections-grid">
        {filtered.map(election => {
          const voted = userVotes[election.election_id] !== undefined;
          const canVote = election.status === 'active' && !voted;

          return (
            <div key={election.election_id} className="election-card">
              <div className="election-card-top">
                <span className="election-icon">{election.icon}</span>
                <span className={`badge ${statusClass[election.status]}`}>
                  <span className="badge-dot" />
                  {statusLabel[election.status]}
                </span>
              </div>
              <h3 className="election-title">{election.title}</h3>
              <p className="election-desc">{election.description}</p>
              <div className="election-dates">
                {election.start_date} → {election.end_date}
              </div>
              {voted && (
                <div className="voted-badge">✓ You have voted</div>
              )}
              <div className="election-actions">
                {canVote && (
                  <button className="btn btn-primary" onClick={() => navigate(`/vote/${election.election_id}`)}>
                    Vote Now
                  </button>
                )}
                <button className="btn btn-outline" onClick={() => navigate(`/results/${election.election_id}`)}>
                  View Results
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
