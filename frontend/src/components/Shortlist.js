import React, { useState } from 'react';

const API = process.env.REACT_APP_API_URL;

export default function Shortlist() {
  const [mode, setMode] = useState('basic'); // 'basic' | 'ai'
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [preferredSkills, setPreferredSkills] = useState([]);
  const [minExperience, setMinExperience] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [prefInput, setPrefInput] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addSkillToList = (input, setInput, list, setList) => {
    const s = input.trim();
    if (s && !list.find(sk => sk.toLowerCase() === s.toLowerCase())) {
      setList([...list, s]);
      setInput('');
    }
  };

  const removeFromList = (skill, list, setList) =>
    setList(list.filter(s => s !== skill));

  const handleKeyDown = (e, input, setInput, list, setList) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkillToList(input, setInput, list, setList); }
  };

  const handleShortlist = async () => {
    if (requiredSkills.length === 0) {
      setError('Please add at least one required skill.');
      return;
    }
    setError(null);
    setLoading(true);
    setResults(null);

    try {
      const endpoint = mode === 'ai' ? '/api/ai/shortlist' : '/api/match';
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requiredSkills,
          preferredSkills,
          minExperience: minExperience ? parseFloat(minExperience) : 0
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'partial';
    return 'low';
  };

  const getTierClass = (tier) => {
    if (!tier) return '';
    if (tier.toLowerCase().includes('high')) return 'tier-high';
    if (tier.toLowerCase().includes('partial')) return 'tier-partial';
    return 'tier-low';
  };

  const highCount = results?.results?.filter(r => (r.matchPercent || r.score || 0) >= 70).length || 0;
  const partialCount = results?.results?.filter(r => {
    const s = r.matchPercent || r.score || 0;
    return s >= 40 && s < 70;
  }).length || 0;

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Shortlist Candidates</h2>
          <p className="section-sub">Enter job requirements to find the best matches.</p>
        </div>
      </div>

      <div className="shortlist-layout">
        {/* ── Left Panel: Job Form ── */}
        <div className="shortlist-panel">
          <div className="mode-toggle">
            <button
              className={`mode-btn ${mode === 'basic' ? 'active' : ''}`}
              onClick={() => setMode('basic')}
            >⚡ Basic Match</button>
            <button
              className={`mode-btn ${mode === 'ai' ? 'active' : ''}`}
              onClick={() => setMode('ai')}
            >🤖 AI Match</button>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20 }}>
            {mode === 'basic'
              ? 'Scores candidates by skill overlap % and experience.'
              : 'Claude AI analyzes profiles and gives nuanced explanations.'}
          </p>

          {/* Required Skills */}
          <div className="form-group">
            <label className="form-label">Required Skills *</label>
            <div className="skill-input-row">
              <input
                className="form-input"
                placeholder="e.g. React"
                value={reqInput}
                onChange={e => setReqInput(e.target.value)}
                onKeyDown={e => handleKeyDown(e, reqInput, setReqInput, requiredSkills, setRequiredSkills)}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addSkillToList(reqInput, setReqInput, requiredSkills, setRequiredSkills)}
              >Add</button>
            </div>
            {requiredSkills.length > 0 && (
              <div className="skill-tags" style={{ marginTop: 10 }}>
                {requiredSkills.map(s => (
                  <span key={s} className="skill-tag">
                    {s}
                    <span className="remove" onClick={() => removeFromList(s, requiredSkills, setRequiredSkills)}>✕</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Preferred Skills */}
          <div className="form-group">
            <label className="form-label">Preferred Skills (bonus)</label>
            <div className="skill-input-row">
              <input
                className="form-input"
                placeholder="e.g. AWS"
                value={prefInput}
                onChange={e => setPrefInput(e.target.value)}
                onKeyDown={e => handleKeyDown(e, prefInput, setPrefInput, preferredSkills, setPreferredSkills)}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addSkillToList(prefInput, setPrefInput, preferredSkills, setPreferredSkills)}
              >Add</button>
            </div>
            {preferredSkills.length > 0 && (
              <div className="skill-tags" style={{ marginTop: 10 }}>
                {preferredSkills.map(s => (
                  <span key={s} className="skill-tag" style={{ background: 'rgba(0,212,170,0.1)', borderColor: 'rgba(0,212,170,0.3)', color: 'var(--accent2)' }}>
                    {s}
                    <span className="remove" onClick={() => removeFromList(s, preferredSkills, setPreferredSkills)}>✕</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Min Experience */}
          <div className="form-group">
            <label className="form-label">Minimum Experience (years)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.5"
              placeholder="e.g. 2"
              value={minExperience}
              onChange={e => setMinExperience(e.target.value)}
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={handleShortlist}
            disabled={loading}
          >
            {loading
              ? (mode === 'ai' ? '🤖 AI Analyzing...' : '⚡ Matching...')
              : (mode === 'ai' ? '🤖 AI Shortlist' : '⚡ Find Matches')}
          </button>
        </div>

        {/* ── Right Panel: Results ── */}
        <div>
          {loading && (
            <div className="loading">
              <div className="spinner" />
              <p>{mode === 'ai' ? '🤖 Claude AI is analyzing all candidate profiles...' : '⚡ Calculating match scores...'}</p>
            </div>
          )}

          {!loading && !results && (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <p>Set your job requirements and click shortlist to see ranked candidates.</p>
            </div>
          )}

          {results && (
            <>
              {/* Stats */}
              <div className="stats-row">
                <div className="stat-chip">
                  <div className="stat-num">{results.total}</div>
                  <div className="stat-lbl">Total</div>
                </div>
                <div className="stat-chip">
                  <div className="stat-num" style={{ color: 'var(--accent2)' }}>{highCount}</div>
                  <div className="stat-lbl">High Match</div>
                </div>
                <div className="stat-chip">
                  <div className="stat-num" style={{ color: 'var(--warn)' }}>{partialCount}</div>
                  <div className="stat-lbl">Partial Match</div>
                </div>
                {results.aiPowered && (
                  <div className="stat-chip" style={{ borderColor: 'var(--accent)' }}>
                    <div className="stat-num" style={{ fontSize: '1rem' }}>🤖</div>
                    <div className="stat-lbl">AI Powered</div>
                  </div>
                )}
              </div>

              {results.results.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">😕</div>
                  <p>No candidates found. Add some candidates first!</p>
                </div>
              )}

              {results.results.map((r, i) => {
                const score = r.matchPercent ?? r.score ?? 0;
                const sc = getScoreClass(score);
                return (
                  <div key={r._id || i} className={`result-card ${sc}`}>
                    {/* Rank */}
                    <div className="result-rank">#{r.rank || i + 1}</div>

                    {/* Body */}
                    <div className="result-body">
                      <div className="result-name">
                        {r.name}
                        {r.tier && (
                          <span className={`tier-badge ${getTierClass(r.tier)}`}>{r.tier}</span>
                        )}
                        {r.standout && <span className="standout-badge">⭐ Standout</span>}
                      </div>
                      <div className="result-meta">
                        ✉ {r.email} &nbsp;·&nbsp; 🕐 {r.experience} yrs experience
                      </div>

                      {/* Skills */}
                      <div className="skill-tags">
                        {r.skills?.map(s => {
                          const isMatched = r.matchedSkills?.map(m => m.toLowerCase()).includes(s.toLowerCase());
                          const isPref = r.matchedPreferred?.map(m => m.toLowerCase()).includes(s.toLowerCase());
                          return (
                            <span
                              key={s}
                              className="skill-tag"
                              style={
                                isMatched
                                  ? { background: 'rgba(0,212,170,0.15)', borderColor: 'rgba(0,212,170,0.4)', color: 'var(--accent2)' }
                                  : isPref
                                  ? { background: 'rgba(255,169,77,0.12)', borderColor: 'rgba(255,169,77,0.3)', color: 'var(--warn)' }
                                  : {}
                              }
                            >
                              {isMatched ? '✓ ' : isPref ? '~ ' : ''}{s}
                            </span>
                          );
                        })}
                      </div>

                      {/* AI Reason */}
                      {r.reason && (
                        <div className="result-reason">
                          <strong>🤖 AI Analysis:</strong> {r.reason}
                        </div>
                      )}

                      {/* Basic match info */}
                      {!r.reason && r.matchedSkills && (
                        <div className="result-reason">
                          <strong>✓ Matched:</strong> {r.matchedSkills.length > 0 ? r.matchedSkills.join(', ') : 'No required skills matched'}
                          {!r.meetsExperience && <span style={{ color: 'var(--danger)', marginLeft: 12 }}>⚠ Below min experience</span>}
                        </div>
                      )}
                    </div>

                    {/* Score circle */}
                    <div className={`score-circle score-${sc}`}>
                      {score}%
                      <span className="score-label">MATCH</span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
