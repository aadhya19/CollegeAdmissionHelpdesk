import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QueryFilters from '../../components/QueryFilters';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    startDate: '',
    endDate: '',
    queryId: '',
    email: '',
    keyword: ''
  });

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Add all non-empty filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`http://localhost:5000/api/admin/queries?${queryParams.toString()}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setQueries(data.queries);
      } else {
        console.error('Error fetching queries:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchQueries();
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
      keyword: ''
    });
    fetchQueries();
  };

  const handleQueryClick = (queryId) => {
    navigate(`/admin/queries/${queryId}`);
  };

  const handleMarkAsPublic = (queryId) => {
    navigate(`/admin/queries/${queryId}/public`);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard Overview</h1>
        <p>Welcome to the VIT Help Desk Admin Panel. Here you can manage queries, FAQs, announcements, and view analytics.</p>
      </div>

      <QueryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleReset}
        isAdminView={true}
      />

      <div className="queries-list">
        {loading ? (
          <div className="loading">Loading queries...</div>
        ) : queries.length === 0 ? (
          <div className="no-queries">No queries found</div>
        ) : (
          <table className="queries-table">
            <thead>
              <tr>
                <th>Query ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((query) => (
                <tr key={query._id}>
                  <td>{query.queryId}</td>
                  <td>{query.title}</td>
                  <td>
                    <span className={`status-badge ${query.status.toLowerCase()}`}>
                      {query.status}
                    </span>
                  </td>
                  <td>{new Date(query.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(query.updatedAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button 
                      className="view-btn"
                      onClick={() => handleQueryClick(query.queryId)}
                    >
                      View
                    </button>
                    {query.publicConsent && !query.markedPublic && query.status === "Resolved" && (
                      <button 
                        className="public-btn"
                        onClick={() => handleMarkAsPublic(query.queryId)}
                      >
                        Mark as Public
                      </button>
                    )}
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

export default Dashboard; 