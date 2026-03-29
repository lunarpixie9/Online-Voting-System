import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockElections, mockCandidates, castVote, hasVoted } from '../utils/mockData';
import './Vote.css';

export default function Vote() {
  const { electionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const id = parseInt(electionId);

  const election = mockElections.find(e => e.election_id === id);
  const candidates = mockCandidates[id] || [];
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!election) return <div style={{ padding: '3rem', textAlign: 'center' }}>Election not found.</div>;
  if (hasVoted(user?.voter_id, id)) return (
    <div className="vote-done">
      <div className="vote-done-icon">✓</div>
      <h2>You've already voted</h2>
      <p>Your vote for this election has been recorded.</p>
      <button className="btn btn-primary" onClick={() => navigate(`/results/${id}`)}>View Results</button>
    </div>
  );

  const handleSubmit = async () => {
    if (!selected) return setError('Please select a candidate before submitting.');
    setError('');
    setConfirmed(false);

    const success = castVote(user.voter_id, id, selected);
    if (success) setSubmitted(true);
    else setError('Could not cast vote. Please try again.');
  };

  if (submitted) return (
    <div className="vote-done">
      <div className="vote-done-icon success">✓</div>
      <h2>Vote cast successfully!</h2>
      <p>Your vote has been recorded securely. Thank you for participating.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => navigate(`/results/${id}`)}>View Results</button>
        <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>Back to Elections</button>
      </div>
    </div>
  );

  return (
    <div className="vote-page">
      <div className="vote-header">
        <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => navigate('/dashboard')}>← Back</button>
        <div>
          <h1>{election.title}</h1>
          <p>{election.description}</p>
        </div>
        <div className="vote-step">
          <span className={`step ${!selected ? 'active' : 'done'}`}>1. Choose</span>
          <span className="step-line" />
          <span className={`step ${selected && !submitted ? 'active' : ''}`}>2. Confirm</span>
          <span className="step-line" />
          <span className={`step ${submitted ? 'done' : ''}`}>3. Done</span>
        </div>
      </div>

      {error && <div className="alert alert-error" style={{ maxWidth: 700, margin: '0 auto 1rem' }}>{error}</div>}

      <div className="candidates-grid">
        {candidates.map(candidate => (
          <div
            key={candidate.candidate_id}
            className={`candidate-card ${selected === candidate.candidate_id ? 'selected' : ''}`}
            onClick={() => { setSelected(candidate.candidate_id); setConfirmed(false); }}
          >
            <div className="candidate-avatar">{candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
            <h3>{candidate.name}</h3>
            <p className="candidate-party">{candidate.party}</p>
            <p className="candidate-bio">{candidate.bio}</p>
            {selected === candidate.candidate_id && <div className="selected-check">✓ Selected</div>}
          </div>
        ))}
      </div>

      <div className="vote-action">
        {selected && !confirmed && (
          <button className="btn btn-primary" style={{ padding: '12px 32px' }} onClick={() => setConfirmed(true)}>
            Confirm Selection →
          </button>
        )}
        {confirmed && (
          <div className="confirm-box">
            <p>You are voting for <strong>{candidates.find(c => c.candidate_id === selected)?.name}</strong>. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={handleSubmit}>Cast My Vote</button>
              <button className="btn btn-ghost" onClick={() => setConfirmed(false)}>Go Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
