import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import './Results.css';

function ResultsForElection({ electionId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getResults(electionId).then(res => {
      if (res.success) setData(res);
    });
  }, [electionId]);

  if (!data) return <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: 14 }}>Loading...</div>;

  const { election, candidates, total_votes } = data;
  const sorted = [...candidates].sort((a, b) => b.vote_count - a.vote_count);
  const winner = sorted[0];

  return (
    <div className="results-section">
      <div className="results-section-header">
        <span className="election-icon-sm">🗳️</span>
        <div>
          <h2>{election.title}</h2>
          <p>{total_votes} votes cast</p>
        </div>
        {election.status === 'closed' && winner?.vote_count > 0 && (
          <div className="winner-badge">🏆 {winner.name} won</div>
        )}
      </div>

      <div className="results-bars">
        {sorted.map((c, i) => (
          <div key={c.candidate_id} className="result-row">
            <div className="result-meta">
              <div className="result-avatar" style={{
                background: i === 0 ? 'var(--purple)' : 'var(--bg-secondary)',
                color: i === 0 ? '#fff' : 'var(--text-muted)',
                border: i === 0 ? 'none' : '1px solid var(--border)'
              }}>
                {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="result-name">
                  {c.name}
                  {i === 0 && total_votes > 0 && <span className="leading-tag">Leading</span>}
                </p>
                <p className="result-party">{c.party}</p>
              </div>
            </div>
            <div className="result-bar-wrap">
              <div className="result-bar-track">
                <div className="result-bar-fill" style={{
                  width: `${c.percentage}%`,
                  background: i === 0 ? 'var(--purple)' : 'var(--purple-mid)'
                }} />
              </div>
              <span className="result-pct">{c.percentage}%</span>
              <span className="result-votes">{c.vote_count} votes</span>
            </div>
          </div>
        ))}
        {total_votes === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No votes cast yet.</p>}
      </div>
    </div>
  );
}

export default function Results() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [selected, setSelected] = useState(electionId ? parseInt(electionId) : 'all');

  useEffect(() => {
    api.getElections().then(data => {
      if (data.success) setElections(data.elections);
    });
  }, []);

  const toShow = selected === 'all' ? elections : elections.filter(e => e.election_id == selected);

  return (
    <div className="results-page">
      <div className="results-header">
        <div>
          <h1>Election Results</h1>
          <p>Live vote counts for all CHRIST University elections.</p>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => navigate('/dashboard')}>← Back</button>
      </div>

      <div className="results-nav">
        <button className={`res-tab ${selected === 'all' ? 'active' : ''}`} onClick={() => setSelected('all')}>All Elections</button>
        {elections.map(e => (
          <button key={e.election_id} className={`res-tab ${selected == e.election_id ? 'active' : ''}`} onClick={() => setSelected(e.election_id)}>
            🗳️ {e.title.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="results-list">
        {toShow.map(e => <ResultsForElection key={e.election_id} electionId={e.election_id} />)}
      </div>
    </div>
  );
}