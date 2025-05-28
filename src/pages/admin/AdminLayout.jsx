import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/AdminLayout.css';
import vitLogo from '../../assets/vit-logo.png';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/public-queries', label: 'Public Queries', icon: '🌐' },
    { path: '/admin/faqs', label: 'FAQ Management', icon: '❓' },
    { path: '/admin/announcements', label: 'Announcements', icon: '📢' },
    { path: '/admin/analytics', label: 'Analytics & Reports', icon: '📈' },
  ];

  const handleLogout = async () => {
    console.log("logging out");
    try {
      const response = await fetch('http://localhost:5000/api/admin/logout', {
        credentials: 'include'
      });
      console.log("response", response);
      if (response.ok) {
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={vitLogo} alt="VIT Logo" className="sidebar-logo"/>
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

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="mobile-header">
          <button className="menu-toggle">
            <i className="bi bi-list"></i>
          </button>
          <img src={vitLogo} alt="VIT Logo" className="mobile-logo" />
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 