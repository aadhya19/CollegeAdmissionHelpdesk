import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import vitLogo from '../assets/vit-logo.png';
import { FaHome, FaPencilAlt, FaSearch, FaGlobe, FaQuestionCircle, FaEnvelope } from 'react-icons/fa';
import '../styles/PublicLayout.css';

const PublicLayout = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Home', icon: <FaHome className="icon-home" /> },
    { path: '/post-query', label: 'Post Query', icon: <FaPencilAlt className="icon-post" /> },
    { path: '/track-query', label: 'Track Query', icon: <FaSearch className="icon-track" /> },
    { path: '/public-queries', label: 'Public Queries', icon: <FaGlobe className="icon-public" /> },
    { path: '/faq', label: 'FAQ', icon: <FaQuestionCircle className="icon-faq" /> },
    // { path: '/contact', label: 'Contact', icon: <FaEnvelope className="icon-contact" /> }
  ];

  return (
    <div className="public-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={vitLogo} alt="VIT Logo" style={{ height: '40px' }} />
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout; 