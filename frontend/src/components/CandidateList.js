import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL;

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/candidates`);
      const data = await res.json();
      setCandidates(data);
    } catch {
      setError('Could not connect to backend. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCandidates(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    setDeleting(id);
    try {
      await fetch(`${API}/api/candidates/${id}`, { method: 'DELETE' });
      setCandidates(candidates.filter(c => c._id !== id));
    } catch {
      alert('Failed to delete candidate.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = candidates.filter(c => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.skills.some(s => s.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">All Candidates</h2>
          <p className="section-sub">{candidates.length} candidates in the database</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchCandidates}>🔄 Refresh</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 24 }}>
        <input
          className="form-input"
          placeholder="🔍 Search by name, email, or skill..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          Loading candidates...
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <p>{search ? 'No candidates match your search.' : 'No candidates yet. Add some!'}</p>
        </div>
      )}

      <div className="candidates-grid">
        {filtered.map(c => (
          <div key={c._id} className="candidate-card">
            <div className="candidate-name">{c.name}</div>
            <div className="candidate-email">✉ {c.email}</div>
            <div className="candidate-exp">🕐 {c.experience} year{c.experience !== 1 ? 's' : ''} experience</div>
            <div className="skill-tags">
              {c.skills.map(s => (
                <span key={s} className="skill-tag">{s}</span>
              ))}
            </div>
            {c.bio && <div className="candidate-bio">"{c.bio}"</div>}
            <div className="divider" />
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(c._id, c.name)}
              disabled={deleting === c._id}
            >
              {deleting === c._id ? '⏳ Deleting...' : '🗑 Delete'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
