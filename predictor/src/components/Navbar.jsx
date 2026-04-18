import React, { useState, useEffect } from 'react';
import { FaChessKnight } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a href="/" className="nav-brand">
        <FaChessKnight className="brand-icon" />
        RecordLeader
      </a>
      
      <div className="nav-links">
        <a href="#play" className="nav-link">Play</a>
        <a href="#leaderboard" className="nav-link">Leaderboard</a>
        <a href="#tournaments" className="nav-link">Tournaments</a>
        <a href="#learn" className="nav-link">Learn</a>
      </div>

      <div className="nav-profile">
        <div className="user-rating">
          <span className="rating-type">Blitz</span>
          <span className="rating-value">1850</span>
        </div>
        <img 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=050508" 
          alt="User Avatar" 
          className="avatar"
        />
      </div>
    </nav>
  );
};

export default Navbar;
