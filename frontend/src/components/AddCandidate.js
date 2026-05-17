import React, { useState } from 'react';

const API = 'http://localhost:5001';

export default function AddCandidate({ onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', experience: '', bio: '' });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.find(sk => sk.toLowerCase() === s.toLowerCase())) {
      setSkills([...skills, s]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setSkills(skills.filter(s => s !== skill));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!form.name || !form.email || !form.experience) {
      setMessage({ type: 'error', text: 'Please fill in Name, Email, and Experience.' });
      return;
    }
    if (skills.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one skill.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          skills,
          experience: parseFloat(form.experience),
          bio: form.bio.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add candidate');

      setMessage({ type: 'success', text: `✅ ${data.candidate.name} added successfully!` });
      setForm({ name: '', email: '', experience: '', bio: '' });
      setSkills([]);
      setTimeout(() => onSuccess && onSuccess(), 1200);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Add Candidate</h2>
          <p className="section-sub">Fill in the candidate's profile details below.</p>
        </div>
      </div>

      <div className="form-card">
        {message && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              className="form-input"
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              className="form-input"
              type="email"
              placeholder="e.g. rahul@gmail.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Experience */}
          <div className="form-group">
            <label className="form-label">Years of Experience *</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.5"
              placeholder="e.g. 2"
              value={form.experience}
              onChange={e => setForm({ ...form, experience: e.target.value })}
            />
          </div>

          {/* Skills */}
          <div className="form-group">
            <label className="form-label">Skills *</label>
            <div className="skill-input-row">
              <input
                className="form-input"
                placeholder="Type a skill and press Add or Enter"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button type="button" className="btn btn-secondary" onClick={addSkill}>Add</button>
            </div>
            <p className="form-hint">Press Enter or click Add after each skill.</p>
            {skills.length > 0 && (
              <div className="skill-tags">
                {skills.map(sk => (
                  <span key={sk} className="skill-tag">
                    {sk}
                    <span className="remove" onClick={() => removeSkill(sk)}>✕</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">Short Bio / Projects (optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Brief description of the candidate's background, projects, or specializations..."
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? '⏳ Adding...' : '➕ Add Candidate'}
          </button>
        </form>
      </div>
    </div>
  );
}
