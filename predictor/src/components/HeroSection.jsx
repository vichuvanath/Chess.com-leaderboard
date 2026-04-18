import React from 'react';
import { FaPlay, FaTrophy, FaChessKing, FaChessQueen } from 'react-icons/fa';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <FaChessKing className="chess-piece-bg piece-1" />
      <FaChessQueen className="chess-piece-bg piece-2" />
      
      <div className="hero-content">
        <h1 className="hero-title">
          Conquer The Board, <br /><span>Become The Leader</span>
        </h1>
        <p className="hero-subtitle">
          The elite RecordLeader arena for Blitz and Rapid chess. Join grandmasters in real-time masterclass battles.
        </p>
        
        <div className="hero-actions">
          <button className="btn btn-primary">
            <FaPlay /> Play Now
          </button>
          <button className="btn btn-outline-cyan">
            <FaTrophy /> View Leaderboard
          </button>
        </div>

        <div className="stats-container glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
          <div className="stat-item">
            <span className="stat-value">24.5K</span>
            <span className="stat-label">Players Online</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">120K+</span>
            <span className="stat-label">Games Today</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">Blitz/Rapid</span>
            <span className="stat-label">Exclusive</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
