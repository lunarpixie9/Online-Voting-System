import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './Vote.css';

export default function Vote() {
  const { electionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [election, setElection] = useState(null);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCandidates(electionId).then(data => {
      if (data.success) setCandidates(data.candidates);
      setLoading(false);
    });
    api.getElections().then(data => {
      if (data.success) {
        const e = data.elections.find(e => e.election_id == electionId);
        setElection(e);
      }
    });
  }, [electionId]);

  const handleSubmit = async () => {
    if (!selected) return setError('Please select a candidate.');
    setError('');
    const data = await api.castVote(user.voter_id, selected, electionId);
    if (data.success) setSubmitted(true);
    else setError(data.message);
  };

  if (loading) return <p style={{ padding: '3rem', color: 'var(--text-muted)' }}>Loading...</p>;

  if (submitted) return (
    <div className="vote-done">
      <div className="vote-done-icon success">✓</div>
      <h2>Vote cast successfully!</h2>
      <p>Your vote has been recorded securely.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => navigate(`/results/${electionId}`)}>View Results</button>
        <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>Back to Elections</button>
      </div>
    </div>
  );

  return (
    <div className="vote-page">
      <div className="vote-header">
        <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => navigate('/dashboard')}>← Back</button>
        <h1>{election?.title}</h1>
        <p>{election?.description}</p>
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
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={handleSubmit}>Cast My Vote</button>
              <button className="btn btn-ghost" onClick={() => setConfirmed(false)}>Go Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}