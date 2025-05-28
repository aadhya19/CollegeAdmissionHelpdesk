import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ContactPage.css';

const ContactPage = () => {
  const [contacts, setContacts] = useState([]);
  const [keyOfficials, setKeyOfficials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDept, setExpandedDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await axios.get('/api/contact');
      setContacts(response.data.departments);
      setKeyOfficials(response.data.keyOfficials);
    } catch (err) {
      setError('Failed to fetch contact information');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeptToggle = (deptId) => {
    setExpandedDept(expandedDept === deptId ? null : deptId);
  };

  const filteredDepartments = contacts.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.dean.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.associateDean.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.assistantDean.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.director.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading contact information...</div>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="contact-page">
      <h1>Contact Information</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search departments or names..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="departments-section">
        <h2>Departments</h2>
        <div className="departments-list">
          {filterdDepartments.length > 0 &&  filteredDepartments.map((dept) => (
            <div key={dept._id} className="department-card">
              <div 
                className="department-header"
                onClick={() => handleDeptToggle(dept._id)}
              >
                <h3>{dept.name}</h3>
                <span className={`toggle-icon ${expandedDept === dept._id ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>
              
              {expandedDept === dept._id && (
                <div className="department-details">
                  <div className="contact-row">
                    <span className="label">Dean:</span>
                    <span className="value">{dept.dean}</span>
                  </div>
                  <div className="contact-row">
                    <span className="label">Associate Dean:</span>
                    <span className="value">{dept.associateDean}</span>
                  </div>
                  <div className="contact-row">
                    <span className="label">Assistant Dean:</span>
                    <span className="value">{dept.assistantDean}</span>
                  </div>
                  <div className="contact-row">
                    <span className="label">Director:</span>
                    <span className="value">{dept.director}</span>
                  </div>
                  <div className="contact-row">
                    <span className="label">Email:</span>
                    <a href={`mailto:${dept.email}`} className="value">{dept.email}</a>
                  </div>
                  <div className="contact-row">
                    <span className="label">Office Hours:</span>
                    <span className="value">{dept.officeHours}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="key-officials-section">
        <h2>Key Officials</h2>
        <div className="officials-grid">
          {keyOfficials.map((official, index) => (
            <div key={index} className="official-card">
              <h3>{official.designation}</h3>
              <div className="official-details">
                <div className="detail-row">
                  <span className="label">Department:</span>
                  <span className="value">{official.department}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <a href={`mailto:${official.email}`} className="value">{official.email}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="map-section">
        <h2>Location</h2>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0000000000005!2d79.00000000000001!3d12.000000000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad479f0f1f3d9b%3A0x3b9fa80aef6c0b8f!2sVIT%20University!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="VIT Vellore Campus Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 