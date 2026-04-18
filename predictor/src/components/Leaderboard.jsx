import React, { useState } from 'react';
import './Leaderboard.css';

const Leaderboard = () => {
  const [activeCategory, setActiveCategory] = useState('blitz');

  const mockLeaderboard = {
    blitz: [
      { rank: 1, name: 'Hikaru Nakamura', title: 'GM', rating: 3312, winRate: '68%', avatar: 'hikaru' },
      { rank: 2, name: 'Magnus Carlsen', title: 'GM', rating: 3289, winRate: '65%', avatar: 'magnus' },
      { rank: 3, name: 'Daniel Naroditsky', title: 'GM', rating: 3190, winRate: '61%', avatar: 'danya' },
      { rank: 4, name: 'Alireza Firouzja', title: 'GM', rating: 3150, winRate: '59%', avatar: 'alireza' },
      { rank: 5, name: 'Nihal Sarin', title: 'GM', rating: 3105, winRate: '58%', avatar: 'nihal' },
    ],
    rapid: [
      { rank: 1, name: 'Magnus Carlsen', title: 'GM', rating: 2950, winRate: '71%', avatar: 'magnus2' },
      { rank: 2, name: 'Maxime Vachier-Lagrave', title: 'GM', rating: 2890, winRate: '63%', avatar: 'mvl' },
      { rank: 3, name: 'Ian Nepomniachtchi', title: 'GM', rating: 2875, winRate: '60%', avatar: 'nepo' },
      { rank: 4, name: 'Ding Liren', title: 'GM', rating: 2850, winRate: '58%', avatar: 'ding' },
      { rank: 5, name: 'Wesley So', title: 'GM', rating: 2830, winRate: '57%', avatar: 'wesley' },
    ]
  };

  const data = mockLeaderboard[activeCategory];

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return '';
  };

  return (
    <section id="leaderboard" className="leaderboard-section">
      <div className="leaderboard-header">
        <h2 className="leaderboard-title">Global <span>Rankings</span></h2>
        <p className="leaderboard-subtitle">The top rated players in the RecordLeader community</p>
      </div>

      <div className="leaderboard-container">
        <div className="leaderboard-tabs">
          <div 
            className={`lb-tab ${activeCategory === 'blitz' ? 'active blitz' : ''}`}
            onClick={() => setActiveCategory('blitz')}
          >
            Blitz Top 50
          </div>
          <div 
            className={`lb-tab ${activeCategory === 'rapid' ? 'active rapid' : ''}`}
            onClick={() => setActiveCategory('rapid')}
          >
            Rapid Top 50
          </div>
        </div>

        <div className="leaderboard-table-wrapper glass-panel">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Rating</th>
                <th>Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.map((player) => (
                <tr key={player.rank}>
                  <td className={`rank-cell ${getRankClass(player.rank)}`}>
                    #{player.rank}
                  </td>
                  <td>
                    <div className="player-cell">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.avatar}&backgroundColor=0f1016`} 
                        alt={player.name} 
                        className="player-avatar"
                      />
                      <div>
                        {player.title && <span className="player-title">{player.title}</span>}
                        <span className="player-name">{player.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="rating-cell">
                    {player.rating}
                  </td>
                  <td className="winrate-cell">
                    {player.winRate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
