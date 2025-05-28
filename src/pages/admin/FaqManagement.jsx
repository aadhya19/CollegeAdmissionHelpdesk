import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/FAQManagement.css';

const FAQManagement = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/faqs', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch FAQs');
      }
      const data = await response.json();
      setFaqs(data);
    } catch (error) {
      setError('Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/faqs/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to delete FAQ');
      }
      setFaqs(prev => prev.filter(faq => faq._id !== id));
    } catch (error) {
      setError('Failed to delete FAQ');
    }
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  if (loading && !faqs.length) {
    return <div className="loading">Loading FAQs...</div>;
  }

  return (
    <div className="faq-management">
      <div className="header">
        <h1>FAQ Management</h1>
      </div>
      <div className="create-faq-section">
          <button 
            className="create-faq-btn"
            onClick={() => navigate('/admin/faqs/new')}
          >
            Create New FAQ
          </button>
        </div>

      {error && <div className="error-message">{error}</div>}

      <div className="faqs-list">
        {faqs.length === 0 ? (
          <div className="no-faqs">No FAQs found</div>
        ) : (
          <ul className="faq-items">
            {faqs.map(faq => (
              <li key={faq._id} className="faq-item">
                <div className="faq-header">
                  <div className="faq-title">
                    <h3>{faq.question}</h3>
                    <span className="department-tag">{faq.department}</span>
                  </div>
                  <div className="faq-actions">
                    <button
                      className="action-btn"
                      onClick={() => navigate(`/admin/faqs/${faq._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleDelete(faq._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="action-btn expand-btn"
                      onClick={() => toggleFaq(faq._id)}
                    >
                      {expandedFaq === faq._id ? '−' : '+'}
                    </button>
                  </div>
                </div>

                {expandedFaq === faq._id && (
                  <div className="faq-content">
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FAQManagement; 