import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Lobby from './components/Lobby';
import Leaderboard from './components/Leaderboard';
import Tournaments from './components/Tournaments';
import Academy from './components/Academy';
import useScrollReveal from './hooks/useScrollReveal';
import './App.css';

function App() {
  useScrollReveal();

  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        <HeroSection />
        <Lobby />
        <Tournaments />
        <Leaderboard />
        <Academy />
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} <span>RecordLeader</span>. All rights reserved. The masterclass arena for Blitz and Rapid.</p>
      </footer>
    </div>
  );
}

export default App;
