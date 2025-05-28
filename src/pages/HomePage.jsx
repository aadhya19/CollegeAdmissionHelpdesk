import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/announcements');
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }
      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      setError('Error fetching announcements');
    } finally {
      setLoading(false);
    }
  };

  const toggleAnnouncements = () => {
    setShowAllAnnouncements(!showAllAnnouncements);
  };

  if (loading) {
    return <div className="loading">Loading announcements...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-page">
      {/* Header Section */}
      <div className="header">
        <h1>Welcome to VIT Help Desk</h1>
      </div>

      {/* Description Section */}
      <section className="description-section">
        <div className="description-content">
          <p>
            The VIT Help Desk is your one-stop platform for all your queries and concerns.
            Whether you're a student, faculty member, or staff, our dedicated team is here to assist you
            with academic, administrative, and technical support. Get quick responses to your questions,
            access important announcements, and connect with the right department - all in one place.
          </p>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="announcements-section">
        <div className="section-header">
          <h2>Important Announcements</h2>
          <button onClick={toggleAnnouncements} className="view-all-btn">
            {showAllAnnouncements ? 'Show Less' : 'View All'}
          </button>
        </div>
        <div className="announcements-grid">
          {announcements.slice(0, showAllAnnouncements ? announcements.length : 4).map(announcement => (
            <div key={announcement._id} className="announcement-card">
              <div className="announcement-header">
                <h3>{announcement.title}</h3>
                <span className="department-tag">{announcement.department}</span>
              </div>
              <p className="announcement-description">{announcement.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Campus Map Section */}
      <section className="map-section">
        <h2>Campus Location</h2>
        <div className="map-container">
        <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0405081005324!2d79.15465686328346!3d12.969259780384336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad479f0ccbe067%3A0xfef222e5f36ecdeb!2sVellore%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1744687956230!5m2!1sen!2sin"
            width="80%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="VIT Vellore Campus Map"
          ></iframe>
        </div>
      </section>

      {/* Fixed Footer */}
      <footer className="fixed-footer">
        <Link to="/post-query" className="ask-query-btn">Ask a Query</Link>
      </footer>
    </div>
  );
};

export default HomePage; 