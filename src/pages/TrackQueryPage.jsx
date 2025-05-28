import React, { useState, useEffect } from 'react';
import '../styles/TrackQueryPage.css';

const TrackQueryPage = () => {
  const [formData, setFormData] = useState({
    queryId: '',
    email: ''
  });

  const [queryDetails, setQueryDetails] = useState(null);
  const [followUpMessage, setFollowUpMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusCheck = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setQueryDetails(null);

    try {
      console.log(formData.queryId, formData.email);
      const response = await fetch(`http://localhost:5000/api/queries/status?queryId=${formData.queryId}&email=${formData.email}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data) {
        throw new Error('Invalid response from server');
      }
      console.log("data");
      console.log(data.query);
      setQueryDetails(data.query);
    } catch (error) {
      console.error('Error fetching query status:', error);
      setError(error.message || 'Query not found. Please check your Query ID and Email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleFollowUp = async (e) => {
    e.preventDefault();
    if (!followUpMessage.trim() && selectedFiles.length === 0) return;

    try {
      if (!queryDetails || !queryDetails.queryId) {
        throw new Error('Query details not found');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('queryId', queryDetails.queryId);
      formDataToSend.append('email', queryDetails.email);
      formDataToSend.append('message', followUpMessage);

      console.log("query details, ", queryDetails.queryId, queryDetails.email, followUpMessage);
      
      selectedFiles.forEach(file => {
        formDataToSend.append('files', file);
      });

      const response = await fetch(`http://localhost:5000/api/queries/follow-up/${queryDetails.queryId}`, {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to send follow-up');
      }

      const data = await response.json();
      setQueryDetails(data);
      setFollowUpMessage('');
      setSelectedFiles([]);
      setSuccessMessage('Follow-up sent successfully!');
    } catch (error) {
      console.error('Error sending follow-up:', error);
      setError(error.message || 'Failed to send follow-up. Please try again.');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Resolved':
        return 'status-resolved';
      case 'In Progress':
        return 'status-in-progress';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const FilePreview = ({ file, queryId }) => {
    const fileUrl = `http://localhost:5000/uploads/${queryId}/${file.filename}`;
    
    return (
      <div className="file-preview">
        {file.mimetype.startsWith('image/') ? (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <img src={fileUrl} alt={file.originalname} className="preview-image" />
          </a>
        ) : (
          <a href={fileUrl} download={file.originalname} className="file-download">
            <i className="fas fa-file-download"></i>
            <span>{file.originalname}</span>
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="track-query-page">
      <div className="header">
        <h1>Track Your Query</h1>
      </div>

      {/* Status Check Form */}
      <form onSubmit={handleStatusCheck} className="status-form">
        <div className="form-group">
          <label htmlFor="queryId">Query ID</label>
          <input
            type="text"
            id="queryId"
            name="queryId"
            value={formData.queryId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="check-status-btn" disabled={isLoading}>
          {isLoading ? 'Checking...' : 'Check Status'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {/* Query Details Section */}
      {queryDetails && (
        <div className="query-details">
          <div className="query-info-grid">
            <div className="info-card">
              <div className="info-header">
                <h3>{queryDetails.title}</h3>
                <div className={`status-badge ${getStatusClass(queryDetails.status)}`}>
                  {queryDetails.status}
                </div>
              </div>
              <div className="info-content">
                <div className="info-item">
                  <span className="info-label">Department:</span>
                  <span className="info-value">{queryDetails.department}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Submitted:</span>
                  <span className="info-value">{formatDate(queryDetails.createdAt)}</span>
                </div>
                <div className="info-item description">
                  <span className="info-label">Description:</span>
                  <span className="info-value">{queryDetails.description}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline">
            <div className={`timeline-step ${queryDetails.status === 'Submitted' ? 'active' : 'completed'}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Submitted</h4>
                <p>{formatDate(queryDetails.createdAt)}</p>
              </div>
            </div>

            <div className={`timeline-step ${queryDetails.status === 'In Progress' ? 'active' : queryDetails.status === 'Resolved' ? 'completed' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>In Progress</h4>
                {queryDetails.updatedAt && <p>{formatDate(queryDetails.updatedAt)}</p>}
              </div>
            </div>

            <div className={`timeline-step ${queryDetails.status === 'Resolved' ? 'active' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Resolved</h4>
                {queryDetails.resolvedAt && <p>{formatDate(queryDetails.resolvedAt)}</p>}
              </div>
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="conversation-thread">
            <h3>Conversation</h3>
            <div className="messages">
              {queryDetails.conversationHistory.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.from === 'Admin' ? 'admin-message' : 'user-message'}`}
                >
                  <div className="message-bubble">
                    <div className="message-content">
                      <p>{message.message}</p>
                      {message.files && message.files.length > 0 && (
                        <div className="message-files">
                          {message.files.map((file, fileIndex) => (
                            <FilePreview key={fileIndex} file={file} queryId={queryDetails.queryId} />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="message-meta">
                      <span className="message-time">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up Form */}
          <form onSubmit={handleFollowUp} className="follow-up-form">
            <div className="form-group">
              <label htmlFor="followUpMessage">Add a Follow-up Message</label>
              <textarea
                id="followUpMessage"
                value={followUpMessage}
                onChange={(e) => setFollowUpMessage(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="file-upload">
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
              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  <p>Selected files:</p>
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button type="submit" className="submit-follow-up-btn" disabled={!followUpMessage.trim() && selectedFiles.length === 0}>
              Send Follow-up
            </button>
          </form>

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackQueryPage; 