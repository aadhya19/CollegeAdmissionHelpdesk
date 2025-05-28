import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/QueryManagement.css';

const QueryManagement = () => {
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    startDate: '',
    endDate: '',
  });
  const [search, setSearch] = useState({
    queryId: '',
    email: '',
    keywords: '',
  });

  useEffect(() => {
    fetchQueries();
  }, [filters, search]);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.department !== 'all') queryParams.append('department', filters.department);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      
      // Add search parameters
      if (search.queryId) queryParams.append('queryId', search.queryId);
      if (search.email) queryParams.append('email', search.email);
      if (search.keywords) queryParams.append('keywords', search.keywords);

      const response = await fetch(`/api/admin/queries?${queryParams.toString()}`);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch(prev => ({ ...prev, [name]: value }));
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'in progress':
        return 'status-in-progress';
      case 'resolved':
        return 'status-resolved';
      default:
        return '';
    }
  };

  return (
    <div className="query-management">
      <div className="page-header">
        <h1>Query Management</h1>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Status:</label>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Department:</label>
          <select name="department" value={filters.department} onChange={handleFilterChange}>
            <option value="all">All Departments</option>
            <option value="academic">Academic</option>
            <option value="administrative">Administrative</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date Range:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-group">
          <input
            type="text"
            name="queryId"
            placeholder="Search by Query ID"
            value={search.queryId}
            onChange={handleSearchChange}
          />
        </div>
        <div className="search-group">
          <input
            type="email"
            name="email"
            placeholder="Search by Email"
            value={search.email}
            onChange={handleSearchChange}
          />
        </div>
        <div className="search-group">
          <input
            type="text"
            name="keywords"
            placeholder="Search by Keywords"
            value={search.keywords}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Queries Table */}
      <div className="queries-table">
        {loading ? (
          <div className="loading">Loading queries...</div>
        ) : queries.length === 0 ? (
          <div className="no-queries">No queries found</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Query ID</th>
                <th>Title</th>
                <th>Department</th>
                <th>Status</th>
                <th>Submission Date</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((query) => (
                <tr
                  key={query._id}
                  onClick={() => navigate(`/admin/queries/${query._id}`)}
                  className="query-row"
                >
                  <td>{query.queryId}</td>
                  <td>{query.title}</td>
                  <td>{query.department}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(query.status)}`}>
                      {query.status}
                    </span>
                  </td>
                  <td>{new Date(query.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default QueryManagement; 