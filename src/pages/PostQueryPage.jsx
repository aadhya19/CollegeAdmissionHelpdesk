import React, { useState } from 'react';
import '../styles/PostQueryPage.css';

const PostQueryPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    title: '',
    description: '',
    publicConsent: false
  });

  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queryId, setQueryId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const departments = [
    'Admissions',
    'IT',
    'Finance',
    'Academics',
    'Hostel'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.title) {
      newErrors.title = 'Query title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    setQueryId(null);

    try {
      const formDataToSend = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append files
      files.forEach(file => {
        formDataToSend.append('files', file);
      });
      console.log(formDataToSend);
      const response = await fetch('http://localhost:5000/api/queries/post', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit query');
      }

      setQueryId(data.queryId);
      setSuccessMessage('Query submitted successfully!');
      setFormData({
        name: '',
        email: '',
        department: '',
        title: '',
        description: '',
        publicConsent: false
      });
      setFiles([]);
    } catch (error) {
      console.error('Error submitting query:', error);
      setErrors({
        submit: error.message || 'Failed to submit query. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-query-page">
      <div className="header">
        <h1>Post a Query</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="query-form">
        <div className="form-group">
          <label htmlFor="name">Name (Optional)</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="department">Department *</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && <span className="error">{errors.department}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="title">Query Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={100}
            required
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Detailed Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="files">Attach Files (Optional)</label>
          <input
            type="file"
            id="files"
            name="files"
            onChange={handleFileChange}
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
          />
          <small>Accepted formats: PDF, JPG, PNG, GIF, DOC (Max 5MB each)</small>
          {files.length > 0 && (
            <div className="selected-files">
              <p>Selected files:</p>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="form-group radio-group">
          <label>Query Visibility</label>
          <div className="radio-options">
            <label>
              <input
                type="radio"
                name="publicConsent"
                value="false"
                checked={!formData.publicConsent}
                onChange={handleChange}
              />
              Keep Private
            </label>
            <label>
              <input
                type="radio"
                name="publicConsent"
                value="true"
                checked={formData.publicConsent}
                onChange={handleChange}
              />
              Make Public
            </label>
          </div>
        </div>

        {errors.submit && <div className="error-message">{errors.submit}</div>}
        {successMessage && (
          <div className="success-message">
            {successMessage}
            {queryId && <p>Your Query ID: <strong>{queryId}</strong></p>}
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Query'}
        </button>
      </form>
    </div>
  );
};

export default PostQueryPage; 