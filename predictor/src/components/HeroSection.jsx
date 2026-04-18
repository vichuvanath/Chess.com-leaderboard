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
          Community Hub <br /><span>Chess.com Leaderboard</span>
        </h1>
        <p className="hero-subtitle">
          Create communities, link Chess.com accounts, and track Blitz & Rapid ratings in real-time.
        </p>
        
        <div className="hero-actions">
          <a href="#leaderboard" className="btn btn-primary">
             Explore Communities
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
