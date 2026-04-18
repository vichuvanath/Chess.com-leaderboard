import React from 'react';
import { FaPlayCircle } from 'react-icons/fa';
import './Academy.css';

const Academy = () => {
  const courses = [
    {
      id: 1,
      level: "Advanced",
      title: "Mastering the Sicilian Defense",
      author: "GM Garry Kasparov",
      avatar: "garry",
      image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      level: "Intermediate",
      title: "Endgame Fundamentals: Pawn Structures",
      author: "GM Magnus Carlsen",
      avatar: "magnus2",
      image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      level: "All Levels",
      title: "Blitz Tactics & Time Management",
      author: "GM Hikaru Nakamura",
      avatar: "hikaru",
      image: "https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <section id="learn" className="academy-section reveal">
      <div className="academy-header">
        <h2 className="academy-title">RecordLeader <span>Masterclass</span></h2>
        <p style={{ color: 'var(--text-secondary)' }}>Elevate your game with exclusive courses from World Champions.</p>
      </div>

      <div className="academy-grid">
        {courses.map((course, index) => (
          <div key={course.id} className={`course-card reveal delay-${index + 1}`}>
            <div className="course-thumbnail">
              <img src={course.image} alt={course.title} />
              <FaPlayCircle className="play-icon" />
            </div>
            <div className="course-content">
              <div className="course-level">{course.level}</div>
              <h3 className="course-title">{course.title}</h3>
              <div className="course-author">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.avatar}&backgroundColor=0f1016`} 
                  alt={course.author} 
                  className="author-avatar"
                />
                <span className="author-name">{course.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Academy;
