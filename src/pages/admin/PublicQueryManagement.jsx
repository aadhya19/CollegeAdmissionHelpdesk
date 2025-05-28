import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QueryFilters from '../../components/QueryFilters';
import '../../styles/PublicQueryManagement.css';

const PublicQueryManagement = () => {
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    startDate: '',
    endDate: '',
    queryId: '',
    email: '',
    keyword: '',
    department: ''
  });

  useEffect(() => {
    fetchPublicQueries();
  }, []);

  const fetchPublicQueries = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Add all non-empty filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '' && value !== 'all') {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`http://localhost:5000/api/admin/public/queries?${queryParams.toString()}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setQueries(data);
    } catch (error) {
      console.error('Error fetching public queries:', error);
      setError('Failed to fetch public queries');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchPublicQueries();
  };

  const handleReset = () => {
    setFilters({
      status: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      startDate: '',
      endDate: '',
      queryId: '',
      email: '',
      keyword: '',
      department: ''
    });
    fetchPublicQueries();
  };

  const handleRemove = async (queryId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/queries/${queryId}/private`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        setQueries(prevQueries => prevQueries.filter(query => query.queryId !== queryId));
        setSuccessMessage('Query removed from public view');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to remove query');
      }
    } catch (error) {
      console.error('Error removing query:', error);
      setError('An error occurred while removing query');
    }
  };

  const handleEdit = (queryId) => {
    navigate(`/admin/queries/${queryId}/public`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading public queries...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="public-query-management">
      <div className="header">
        <h1>Public Query Management</h1>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </div>

      <QueryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleReset}
        isAdminView={true}
      />

      <div className="queries-list">
        {queries.length === 0 ? (
          <div className="no-results">
            No public queries found.
          </div>
        ) : (
          <table className="queries-table">
            <thead>
              <tr>
                <th>Query ID</th>
                <th>Title</th>
                <th>Department</th>
                <th>Created At</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((query) => (
                <tr key={query._id}>
                  <td>{query.queryId}</td>
                  <td>{query.public.title}</td>
                  <td>
                    <span className="department-badge">
                      {query.department}
                    </span>
                  </td>
                  <td>{formatDate(query.createdAt)}</td>
                  <td>{formatDate(query.updatedAt)}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleEdit(query.queryId)}
                      className="edit-btn"
                      title="Edit Public Query"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemove(query.queryId)}
                      className="remove-btn"
                      title="Remove from Public View"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PublicQueryManagement; 