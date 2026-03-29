import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockElections, mockCandidates } from '../utils/mockData';
import './Results.css';

function ResultsForElection({ electionId }) {
  const id = parseInt(electionId);
  const election = mockElections.find(e => e.election_id === id);
  const candidates = mockCandidates[id] || [];
  if (!election) return null;

  const total = candidates.reduce((s, c) => s + c.votes, 0);
  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
  const winner = sorted[0];

  return (
    <div className="results-section">
      <div className="results-section-header">
        <span className="election-icon-sm">{election.icon}</span>
        <div>
          <h2>{election.title}</h2>
          <p>{total} votes cast</p>
        </div>
        {election.status === 'closed' && winner && (
          <div className="winner-badge">🏆 {winner.name} won</div>
        )}
      </div>

      <div className="results-bars">
        {sorted.map((c, i) => {
          const pct = total > 0 ? Math.round((c.votes / total) * 100) : 0;
          return (
            <div key={c.candidate_id} className="result-row">
              <div className="result-meta">
                <div className="result-avatar" style={{ background: i === 0 ? 'var(--purple)' : 'var(--bg-secondary)', color: i === 0 ? '#fff' : 'var(--text-muted)', border: i === 0 ? 'none' : '1px solid var(--border)' }}>
                  {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="result-name">{c.name} {i === 0 && total > 0 && <span className="leading-tag">Leading</span>}</p>
                  <p className="result-party">{c.party}</p>
                </div>
              </div>
              <div className="result-bar-wrap">
                <div className="result-bar-track">
                  <div className="result-bar-fill" style={{ width: `${pct}%`, background: i === 0 ? 'var(--purple)' : 'var(--purple-mid)' }} />
                </div>
                <span className="result-pct">{pct}%</span>
                <span className="result-votes">{c.votes} votes</span>
              </div>
            </div>
          );
        })}
        {total === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No votes have been cast yet.</p>}
      </div>
    </div>
  );
}

export default function Results() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(electionId ? parseInt(electionId) : 'all');

  const elections = selected === 'all' ? mockElections : mockElections.filter(e => e.election_id === selected);

  return (
    <div className="results-page">
      <div className="results-header">
        <div>
          <h1>Election Results</h1>
          <p>Live vote counts for all CHRIST University elections.</p>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => navigate('/dashboard')}>← Back to Elections</button>
      </div>

      <div className="results-nav">
        <button className={`res-tab ${selected === 'all' ? 'active' : ''}`} onClick={() => setSelected('all')}>All Elections</button>
        {mockElections.map(e => (
          <button key={e.election_id} className={`res-tab ${selected === e.election_id ? 'active' : ''}`} onClick={() => setSelected(e.election_id)}>
            {e.icon} {e.title.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="results-list">
        {elections.map(e => <ResultsForElection key={e.election_id} electionId={e.election_id} />)}
      </div>
    </div>
  );
}
