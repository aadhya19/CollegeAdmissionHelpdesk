import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/PublicQueryPage.css';

const PublicQueryPage = () => {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [expandedQuery, setExpandedQuery] = useState(null);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchPublicQueries();
  }, []);

  const fetchPublicQueries = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/public/queries');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const queries = await response.json();
      setQueries(queries);
      setFilteredQueries(queries);
      
      // Extract unique departments
      const uniqueDepts = [...new Set(queries.map(q => q.department))];
      setDepartments(uniqueDepts);
    } catch (error) {
      console.error('Error fetching public queries:', error);
      setError('Failed to fetch public queries');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterQueries(value, selectedDepartment, sortBy);
  };

  const handleSort = (value) => {
    setSortBy(value);
    filterQueries(searchTerm, selectedDepartment, value);
  };

  const handleDepartmentFilter = (value) => {
    setSelectedDepartment(value);
    filterQueries(searchTerm, value, sortBy);
  };

  const filterQueries = (search, department, sort) => {
    let filtered = [...queries];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(query => 
        query.title.toLowerCase().includes(search.toLowerCase()) ||
        query.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply department filter
    if (department !== 'all') {
      filtered = filtered.filter(query => query.department === department);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      return sort === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredQueries(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading public queries...</div>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="public-queries-page">
      <div className="header">
        <h1>Public Queries</h1>
      </div>

      <div className="filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select 
            value={sortBy} 
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="newest">Newest Resolved</option>
            <option value="oldest">Oldest Resolved</option>
          </select>

          <select
            value={selectedDepartment}
            onChange={(e) => handleDepartmentFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="queries-list">
        {filteredQueries.length > 0 ? (
          filteredQueries.map((query) => (
            <div key={query._id} className="query-item">
              <div className="query-content">
                <div className="query-main">
                  <h3 className="query-title">{query.public.title}</h3>
                  <p className="query-description-preview">
                    {query.public.description}
                  </p>
                  <div className="query-meta">
                    <span className="meta-item department">
                      <span className="meta-label">Department:</span>
                      {query.department}
                    </span>
                    <span className="meta-item">
                      <span className="meta-label">Posted:</span>
                      {formatDate(query.createdAt)}
                    </span>
                    <span className="meta-item">
                      <span className="meta-label">Last Updated:</span>
                      {formatDate(query.updatedAt)}
                    </span>
                  </div>
                </div>
                <button 
                  className={`expand-button ${expandedQuery === query._id ? 'expanded' : ''}`}
                  onClick={() => setExpandedQuery(expandedQuery === query._id ? null : query._id)}
                  aria-label="Toggle admin response"
                >
                  <span className="expand-icon"></span>
                </button>
              </div>
              
              {expandedQuery === query._id && (
                <div className="admin-response">
                  <h4>Admin Response</h4>
                  <p>{query.public.response}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No public queries found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicQueryPage; 