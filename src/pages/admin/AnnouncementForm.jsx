import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/AnnouncementForm.css';

const AnnouncementForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/admin/announcements/${id}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch announcement');
      }
      const announcement = await response.json();
      setFormData({
        title: announcement.title,
        description: announcement.description,
        });
    } catch (error) {
      setError('Failed to fetch announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const baseUrl = 'http://localhost:5000';
      const url = id ? `/api/admin/announcements/update/${id}` : '/api/admin/announcements';
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(baseUrl + url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save announcement');
      }

      navigate('/admin/announcements');
    } catch (error) {
      setError('Failed to save announcement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="announcement-form-container">
      <div className="header">
        <h1>{id ? 'Edit Announcement' : 'Create New Announcement'}</h1>
      </div>
      
      <div className="form-container">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin/announcements')}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementForm; 