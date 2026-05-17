import React, { useState } from 'react';
import AddCandidate from './components/AddCandidate';
import CandidateList from './components/CandidateList';
import Shortlist from './components/Shortlist';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [refreshFlag, setRefreshFlag] = useState(0);

  const triggerRefresh = () => setRefreshFlag(f => f + 1);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">TalentMatch<span className="logo-ai">AI</span></span>
          </div>
          <nav className="nav">
            {[
              { id: 'home', label: '🏠 Dashboard' },
              { id: 'add', label: '➕ Add Candidate' },
              { id: 'candidates', label: '👥 All Candidates' },
              { id: 'shortlist', label: '🎯 Shortlist' },
            ].map(item => (
              <button
                key={item.id}
                className={`nav-btn ${activePage === item.id ? 'active' : ''}`}
                onClick={() => setActivePage(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {activePage === 'home' && (
          <div className="home">
            <div className="hero">
              <h1 className="hero-title">
                Hire Smarter with <span className="highlight">AI</span>
              </h1>
              <p className="hero-sub">
                Instantly match, rank, and shortlist candidates using skill analysis and AI intelligence.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => setActivePage('add')}>
                  ➕ Add Candidate
                </button>
                <button className="btn btn-secondary" onClick={() => setActivePage('shortlist')}>
                  🎯 Start Shortlisting
                </button>
              </div>
            </div>

            <div className="feature-cards">
              {[
                { icon: '🧠', title: 'AI-Powered Ranking', desc: 'Claude AI analyzes profiles beyond keyword matching to find the true best fit.' },
                { icon: '⚡', title: 'Instant Matching', desc: 'Skill overlap scoring with experience filtering in real time.' },
                { icon: '📊', title: 'Visual Results', desc: 'Clear match scores, tier labels, and AI explanations for every candidate.' },
                { icon: '🗄️', title: 'MongoDB Storage', desc: 'Persistent candidate database. Add, view, and manage profiles easily.' },
              ].map((f, i) => (
                <div key={i} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === 'add' && (
          <AddCandidate onSuccess={() => { triggerRefresh(); setActivePage('candidates'); }} />
        )}

        {activePage === 'candidates' && (
          <CandidateList key={refreshFlag} />
        )}

        {activePage === 'shortlist' && (
          <Shortlist />
        )}
      </main>

      <footer className="footer">
        <p>TalentMatch AI — Built with React, Node.js, MongoDB & Claude AI</p>
      </footer>
    </div>
  );
}

export default App;
