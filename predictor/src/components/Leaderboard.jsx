import React, { useState, useEffect, useRef } from 'react';
import './Leaderboard.css';

const API_BASE = "http://localhost:8000";

const Leaderboard = () => {
  const [activeCategory, setActiveCategory] = useState('blitz');
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCommName, setNewCommName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddComm, setShowAddComm] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchTimer = useRef(null);

  const fetchCommunities = async () => {
    try {
      const resp = await fetch(`${API_BASE}/communities`);
      const data = await resp.json();
      setCommunities(data);
      if (data.length > 0 && !activeCommunity) {
        setActiveCommunity(data[0]);
      }
    } catch (e) {
      console.error("Failed to fetch communities", e);
    }
  };

  const fetchLeaderboard = async (commId) => {
    if (!commId) return;
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/communities/${commId}/leaderboard`);
      const data = await resp.json();
      setPlayers(data.players || []);
    } catch (e) {
      console.error("Failed to fetch leaderboard", e);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    if (!newCommName) return;
    try {
      const resp = await fetch(`${API_BASE}/communities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCommName })
      });
      if (resp.ok) {
        setNewCommName('');
        setShowAddComm(false);
        fetchCommunities();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSuggestions = (q) => {
    setNewUsername(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (q.length < 1) { setSuggestions([]); return; }
    searchTimer.current = setTimeout(async () => {
      try {
        const resp = await fetch(`${API_BASE}/search-users?q=${q}`);
        const data = await resp.json();
        setSuggestions(data);
      } catch (e) {
        console.error(e);
      }
    }, 300);
  };

  const handleAddUser = async (e, usernameOverride = null) => {
    if (e) e.preventDefault();
    const username = (usernameOverride || newUsername).trim();
    if (!username || !activeCommunity) return;
    try {
      const resp = await fetch(`${API_BASE}/communities/${activeCommunity.id}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      if (resp.ok) {
        setNewUsername('');
        setSuggestions([]);
        setShowAddUser(false);
        fetchLeaderboard(activeCommunity.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchCommunities(); }, []);
  useEffect(() => { if (activeCommunity) fetchLeaderboard(activeCommunity.id); }, [activeCommunity]);

  const sortedPlayers = [...players].sort((a, b) => (b[activeCategory] || 0) - (a[activeCategory] || 0));

  const getRankClass = (index) => {
    if (index === 0) return 'rank-1';
    if (index === 1) return 'rank-2';
    if (index === 2) return 'rank-3';
    return '';
  };

  return (
    <section id="leaderboard" className="leaderboard-section">
      <div className="leaderboard-header">
        <h2 className="leaderboard-title">Community <span>Leaderboards</span></h2>
        <p className="leaderboard-subtitle">Live rankings synced with Chess.com</p>
      </div>

      <div className="leaderboard-container">
        {/* Community Selector */}
        <div className="community-selector">
          {communities.map(comm => (
            <button
              key={comm.id}
              onClick={() => setActiveCommunity(comm)}
              className={`comm-btn ${activeCommunity?.id === comm.id ? 'active' : ''}`}
            >
              {comm.name}
            </button>
          ))}
          <button
            onClick={() => setShowAddComm(!showAddComm)}
            className="btn-outline-cyan"
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }}
          >
            {showAddComm ? 'Cancel' : '+ New Community'}
          </button>
        </div>

        {showAddComm && (
          <form onSubmit={handleCreateCommunity} className="glass-panel admin-form">
            <input
              type="text"
              placeholder="Enter Community Name..."
              value={newCommName}
              onChange={(e) => setNewCommName(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">Create Community</button>
          </form>
        )}

        {/* Tabs + Add Player */}
        <div className="leaderboard-tabs">
          <div
            className={`lb-tab ${activeCategory === 'blitz' ? 'active blitz' : ''}`}
            onClick={() => setActiveCategory('blitz')}
          >
            Blitz Rankings
          </div>
          <div
            className={`lb-tab ${activeCategory === 'rapid' ? 'active rapid' : ''}`}
            onClick={() => setActiveCategory('rapid')}
          >
            Rapid Rankings
          </div>
          <button
            onClick={() => { setShowAddUser(!showAddUser); setSuggestions([]); setNewUsername(''); }}
            className="btn btn-outline-cyan"
            style={{ marginLeft: 'auto', padding: '10px 20px', borderRadius: '30px' }}
          >
            {showAddUser ? 'Cancel' : '+ Add Player'}
          </button>
        </div>

        {/* Add Player form with suggestions */}
        {showAddUser && (
          <div className="glass-panel" style={{ marginBottom: '20px' }}>
            <form onSubmit={handleAddUser} className="admin-form" style={{ marginBottom: 0, alignItems: 'flex-start' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                <input
                  type="text"
                  placeholder="Enter Chess.com Username..."
                  value={newUsername}
                  onChange={(e) => handleSearchSuggestions(e.target.value)}
                  required
                  style={{ width: '100%' }}
                  autoComplete="off"
                />
                {suggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.map(s => (
                      <div
                        key={s}
                        className="suggestion-item"
                        onMouseDown={(e) => { e.preventDefault(); handleAddUser(null, s); }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary">Add to Community</button>
            </form>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="leaderboard-table-wrapper glass-panel">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--accent-cyan)' }}>
              Synchronizing with Chess.com...
            </div>
          ) : (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Rating</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((player, index) => (
                  <tr key={player.username}>
                    <td className={`rank-cell ${getRankClass(index)}`}>#{index + 1}</td>
                    <td>
                      <a
                        href={`https://www.chess.com/member/${player.username}`}
                        target="_blank"
                        rel="noreferrer"
                        className="player-cell"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <img src={player.avatar} alt={player.username} className="player-avatar" />
                        <div>
                          {player.title && <span className="player-title">{player.title}</span>}
                          <span className="player-name">{player.name || player.username}</span>
                        </div>
                      </a>
                    </td>
                    <td className="rating-cell">{player[activeCategory] || '—'}</td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Live</span>
                    </td>
                  </tr>
                ))}
                {sortedPlayers.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      No players in this community yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
