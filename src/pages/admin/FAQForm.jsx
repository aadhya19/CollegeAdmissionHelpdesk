import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/FAQForm.css';

const FAQForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchFAQ();
    }
  }, [id]);

  const fetchFAQ = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/admin/faqs/${id}`, {credentials: 'include'});
      if (!response.ok) {
        throw new Error('Failed to fetch FAQ');
      }
      const faq = await response.json();
      setFormData({
        question: faq.question,
        answer: faq.answer
      });
    } catch (error) {
      setError('Failed to fetch FAQ');
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
      const url = id ? `/api/admin/faqs/update/${id}` : '/api/admin/faqs';
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(baseUrl + url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save FAQ');
      }

      navigate('/admin/faqs');
    } catch (error) {
      setError('Failed to save FAQ');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="faq-form-container">
      <h1>{id ? 'Edit FAQ' : 'Add New FAQ'}</h1>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="question">Question</label>
          <input
            type="text"
            id="question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="answer">Answer</label>
          <textarea
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/faqs')}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save FAQ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FAQForm; 