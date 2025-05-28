import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/PublicQueryForm.css';

const PublicQueryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    public: {
      title: '',
      description: '',
      response: ''
    }
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQueryDetails();
  }, [id]);

  const fetchQueryDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/admin/queries/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        setQuery(data.query);
        setFormData({
          public: {
            title: data.query.title,
            description: data.query.description,
            response: data.query.public?.response || ''
          }
        });
      } else {
        setError(data.message || 'Error fetching query details');
      }
    } catch (error) {
      setError('An error occurred while fetching query details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      public: {
        ...prev.public,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/admin/queries/${id}/public`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          public: {
            title: formData.public.title,
            description: formData.public.description,
            response: formData.public.response
          },
          markedPublic: true
        })
      });
      
      if (response.ok) {
        navigate('/admin/public-queries');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to make query public');
      }
    } catch (error) {
      setError('An error occurred while making query public');
    }
  };

  if (loading) {
    return <div className="loading">Loading query details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!query) {
    return <div className="not-found">Query not found</div>;
  }

  return (
    <div className="public-query-form">
      <div className="form-header">
        <h1>Make Query Public</h1>
        <p>Create a public version of this query that can be shared with others.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Public Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.public.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Public Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.public.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="response">Public Response</label>
          <textarea
            id="response"
            name="response"
            value={formData.public.response}
            onChange={handleChange}
            required
            placeholder="Write a clear and concise response that will be visible to the public"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Make Public
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublicQueryForm; 
