import React, { useState } from 'react';
import './Lobby.css';

const Lobby = () => {
  const [activeMode, setActiveMode] = useState('blitz');

  const blitzControls = [
    { time: '3 min', inc: '+0', label: 'Blitz' },
    { time: '3 min', inc: '+2', label: 'Blitz' },
    { time: '5 min', inc: '+0', label: 'Blitz' },
    { time: '5 min', inc: '+3', label: 'Blitz' }
  ];

  const rapidControls = [
    { time: '10 min', inc: '+0', label: 'Rapid' },
    { time: '10 min', inc: '+5', label: 'Rapid' },
    { time: '15 min', inc: '+10', label: 'Rapid' },
    { time: '30 min', inc: '+0', label: 'Rapid' }
  ];

  const activeControls = activeMode === 'blitz' ? blitzControls : rapidControls;

  const mockChallenges = [
    { id: 1, name: 'Grandmaster_X', rating: 2450, time: '3+0', mode: 'blitz', avatar: '1' },
    { id: 2, name: 'ChessWizard', rating: 1890, time: '10+0', mode: 'rapid', avatar: '2' },
    { id: 3, name: 'KnightRider', rating: 2100, time: '5+3', mode: 'blitz', avatar: '3' },
    { id: 4, name: 'QueenG', rating: 1750, time: '15+10', mode: 'rapid', avatar: '4' },
    { id: 5, name: 'PawnStar', rating: 2210, time: '3+2', mode: 'blitz', avatar: '5' },
  ];

  return (
    <section id="play" className="lobby-section">
      <div className="lobby-header">
        <h2 className="lobby-title">Matchmaking Arena</h2>
        <p className="lobby-subtitle">Choose your time control or accept an open challenge</p>
      </div>

      <div className="lobby-container">
        {/* Quick Play Panel */}
        <div className="mode-selector glass-panel">
          <div className="mode-tabs">
            <div 
              className={`mode-tab ${activeMode === 'blitz' ? 'active' : ''}`}
              onClick={() => setActiveMode('blitz')}
            >
              Blitz
            </div>
            <div 
              className={`mode-tab ${activeMode === 'rapid' ? 'active' : ''}`}
              onClick={() => setActiveMode('rapid')}
            >
              Rapid
            </div>
          </div>

          <div className="time-controls">
            {activeControls.map((control, index) => (
              <div key={index} className="time-card">
                <div className="time-main">{control.time}</div>
                <div className="time-sub">{control.inc} • {control.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Challenges Panel */}
        <div className="challenges-list glass-panel">
          <div className="challenges-header">
            <h3>Open Challenges</h3>
            <span style={{color: 'var(--accent-cyan)', fontSize: '0.9rem'}}>Live</span>
          </div>
          
          {mockChallenges.map(challenge => (
            <div key={challenge.id} className={`challenge-item ${challenge.mode}`}>
              <div className="challenger-info">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${challenge.avatar}&backgroundColor=0f1016`} 
                  alt="avatar" 
                  className="challenger-avatar"
                />
                <div>
                  <div className="challenger-name">{challenge.name}</div>
                  <div className="challenger-rating">Rating: {challenge.rating}</div>
                </div>
              </div>
              <div className="challenge-details">
                <div className="challenge-time">{challenge.time}</div>
                <div className="challenge-type">{challenge.mode}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Lobby;
