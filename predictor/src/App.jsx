import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Leaderboard from './components/Leaderboard';
import useScrollReveal from './hooks/useScrollReveal';
import './App.css';

function App() {
  useScrollReveal();

  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        <HeroSection />
        <Leaderboard />
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} <span>RecordLeader</span>. All rights reserved. The community hub for Chess.com players.</p>
      </footer>
    </div>
  );
}

export default App;
