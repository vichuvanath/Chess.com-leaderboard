import React from 'react';
import { FaCalendarAlt, FaClock, FaUsers } from 'react-icons/fa';
import './Tournaments.css';

const Tournaments = () => {
  const tournaments = [
    {
      id: 1,
      title: "Grandmaster Blitz Brawl",
      date: "Oct 24, 2026",
      time: "18:00 UTC",
      format: "3+0 Blitz • Arena",
      players: "1,200 Registered",
      prize: "$10,000",
      status: "Upcoming"
    },
    {
      id: 2,
      title: "RecordLeader Rapid Open",
      date: "Oct 26, 2026",
      time: "15:00 UTC",
      format: "10+0 Rapid • Swiss",
      players: "850 Registered",
      prize: "$5,000",
      status: "Registration Open"
    },
    {
      id: 3,
      title: "Midnight Bullet Series",
      date: "Oct 28, 2026",
      time: "00:00 UTC",
      format: "1+0 Bullet • Knockout",
      players: "2,500 Registered",
      prize: "$2,500",
      status: "Filling Fast"
    }
  ];

  return (
    <section id="tournaments" className="tournaments-section reveal">
      <div className="tournaments-header">
        <h2 className="tournaments-title">Elite <span>Tournaments</span></h2>
        <p style={{ color: 'var(--text-secondary)' }}>Compete for glory and massive prize pools.</p>
      </div>

      <div className="tournaments-grid">
        {tournaments.map((t, index) => (
          <div key={t.id} className={`tournament-card reveal delay-${index + 1}`}>
            <div className="t-badge">{t.status}</div>
            <h3 className="t-title">{t.title}</h3>
            
            <div className="t-info">
              <span className="t-info-item"><FaCalendarAlt /> {t.date}</span>
              <span className="t-info-item"><FaClock /> {t.time} • {t.format}</span>
              <span className="t-info-item"><FaUsers /> {t.players}</span>
            </div>

            <div className="t-prize">{t.prize}</div>
            
            <button className="btn btn-primary t-btn">Register Now</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Tournaments;
