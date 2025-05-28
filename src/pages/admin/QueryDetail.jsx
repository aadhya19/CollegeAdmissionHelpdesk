import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/QueryDetail.css';

const FilePreview = ({ file, queryId }) => {
  const isImage = file.mimetype.startsWith('image/');
  const fileUrl = `http://localhost:5000/uploads/${queryId}/${file.filename}`;

  return (
    <div className="file-preview">
      {isImage ? (
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

const QueryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [forwardingNote, setForwardingNote] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // Hardcoded departments
  const departments = [
    'IT',
    'HT',
    'General',
    'Hostel',
    'Finance',
  ];

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
        setSelectedStatus(data.query.status);
      } else {
        setError(data.message || 'Error fetching query details');
      }
    } catch (error) {
      setError('An error occurred while fetching query details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusSelect = (newStatus) => {
    setSelectedStatus(newStatus);
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!response.trim() && selectedFiles.length === 0) return;

    try {
      const formData = new FormData();
      formData.append('queryId', query.queryId);
      formData.append('message', response);
      formData.append('status', selectedStatus);
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const fetchResponse = await fetch(`http://localhost:5000/api/admin/queries/respond/${id}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!fetchResponse.ok) {
        throw new Error('Failed to send response');
      }

      const data = await fetchResponse.json();
      console.log(data)
      setQuery(data);
      setResponse('');
      setSelectedFiles([]);
      setSuccessMessage('Response sent successfully!');
    } catch (error) {
      console.error('Error sending response:', error);
      setError('Failed to send response. Please try again.');
    }
  };

  const handleForward = async () => {
    if (!selectedDepartment) {
      setError('Please select a department to forward to');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/queries/forward/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          toDepartment: selectedDepartment,
          note: forwardingNote
        })
      });

      if (!response.ok) {
        throw new Error('Failed to forward query');
      }

      const data = await response.json();
      setSuccessMessage('Query forwarded successfully!');
      navigate('/admin');
    } catch (error) {
      setError('Failed to forward query. Please try again.');
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
    <div className="query-detail">
      <div className="query-header">
        <h1>Query Details</h1>
        <div className="query-meta">
          <span className="query-id">Query ID: {query.queryId}</span>
          <span className={`status-badge ${query.status.toLowerCase()}`}>
            {query.status}
          </span>
        </div>
      </div>

      <div className="query-info">
        <div className="info-group">
          <h3>Student Information</h3>
          <p><strong>Name:</strong> {query.name}</p>
          <p><strong>Email:</strong> {query.email}</p>
          <p><strong>Department:</strong> {query.department}</p>
        </div>

        <div className="info-group">
          <h3>Query Details</h3>
          <p><strong>Title:</strong> {query.title}</p>
          <p><strong>Description:</strong> {query.description}</p>
          <p><strong>Created:</strong> {new Date(query.createdAt).toLocaleString()}</p>
          <p><strong>Last Updated:</strong> {new Date(query.updatedAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="status-controls">
        <h3>Select Status</h3>
        <div className="status-buttons">
          <button
            className={`status-btn ${selectedStatus === 'Pending' ? 'active' : ''}`}
            onClick={() => handleStatusSelect('Pending')}
          >
            Pending
          </button>
          <button
            className={`status-btn ${selectedStatus === 'In Progress' ? 'active' : ''}`}
            onClick={() => handleStatusSelect('In Progress')}
          >
            In Progress
          </button>
          <button
            className={`status-btn ${selectedStatus === 'Resolved' ? 'active' : ''}`}
            onClick={() => handleStatusSelect('Resolved')}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="conversation">
        <h3>Conversation History</h3>
        <div className="messages">
          {query.conversationHistory.map((message, index) => (
            <div
              key={index}
              className={`message ${message.from === 'Admin' ? 'admin' : 'user'}`}
            >
              <div className="message-header">
                <span className="sender">{message.from}</span>
                <span className="timestamp">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="message-content">{message.message}</div>
              {message.files && message.files.length > 0 && (
                <div className="message-files">
                  {message.files.map((file, fileIndex) => (
                    <FilePreview key={fileIndex} file={file} queryId={query.queryId} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="response-form">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your response here..."
            required
          />
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
          <div className="response-actions">
            <button type="submit" disabled={!response.trim() && selectedFiles.length === 0}>
              Send Response
            </button>
            <span className="status-indicator">
              Status will be updated to: <strong>{selectedStatus}</strong>
            </span>
          </div>
        </form>
      </div>

      {query?.forwardingHistory && query.forwardingHistory.length > 0 && (
        <div className="forwarding-history">
          <h3>Forwarding History</h3>
          <div className="timeline-container">
            <div className="timeline-horizontal">
              {query.forwardingHistory.map((event, index) => (
                <div key={index} className="timeline-event">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="event-header">
                      <span className="department-flow">
                        {event.from} → {event.to}
                      </span>
                      <span className="event-date">
                        {new Date(event.forwardedAt).toLocaleDateString()} at {new Date(event.forwardedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="event-details">
                      <div className="forwarded-by">
                        <div className="admin-name">Forwarded by: {event.forwardedBy.name}</div>
                        <div className="admin-email">{event.forwardedBy.email}</div>
                      </div>
                      {event.note && <p className="forward-note-text">{event.note}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="forward-section">
        <h3>Forward Query</h3>
        <div className="forward-form-minimal">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="forward-select"
          >
            <option value="">Select Department</option>
            {departments
              .filter(dept => dept !== query?.department)
              .map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
          </select>
          <textarea
            value={forwardingNote}
            onChange={(e) => setForwardingNote(e.target.value)}
            placeholder="Add a note (optional)"
            className="forward-note"
          />
          <button 
            onClick={handleForward}
            className="forward-btn-minimal"
            disabled={!selectedDepartment}
          >
            Forward Query
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryDetail; 