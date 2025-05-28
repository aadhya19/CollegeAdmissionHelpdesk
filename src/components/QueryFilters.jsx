import React from 'react';
import '../styles/QueryFilters.css';

const QueryFilters = ({ filters, onFilterChange, onSearch, onReset, isAdminView = false }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="search-filters">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-row">
          {isAdminView && (
            <>
              <div className="search-group">
                <label htmlFor="queryId">Query ID:</label>
                <input
                  type="text"
                  id="queryId"
                  name="queryId"
                  value={filters.queryId || ''}
                  onChange={handleFilterChange}
                  placeholder="Search by Query ID"
                />
              </div>

              <div className="search-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={filters.email || ''}
                  onChange={handleFilterChange}
                  placeholder="Search by Email"
                />
              </div>
            </>
          )}

          <div className="search-group">
            <label htmlFor="keyword">Keyword:</label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              value={filters.keyword || ''}
              onChange={handleFilterChange}
              placeholder="Search in Title/Description"
            />
          </div>
        </div>

        <div className="search-row">
          <div className="search-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate || ''}
              onChange={handleFilterChange}
            />
          </div>

          <div className="search-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate || ''}
              onChange={handleFilterChange}
            />
          </div>

          {isAdminView && (
            <div className="search-group">
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                name="status"
                value={filters.status || 'all'}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          )}
        </div>

        <div className="search-row">
          <div className="search-group">
            <label htmlFor="sortBy">Sort by:</label>
            <select
              id="sortBy"
              name="sortBy"
              value={filters.sortBy || 'createdAt'}
              onChange={handleFilterChange}
            >
              <option value="createdAt">Date Created</option>
              <option value="updatedAt">Last Updated</option>
              {isAdminView && <option value="status">Status</option>}
            </select>
          </div>

          <div className="search-group">
            <label htmlFor="sortOrder">Order:</label>
            <select
              id="sortOrder"
              name="sortOrder"
              value={filters.sortOrder || 'desc'}
              onChange={handleFilterChange}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          <div className="search-actions">
            <button type="submit" className="search-btn">Search</button>
            <button type="button" onClick={onReset} className="reset-btn">Reset</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QueryFilters; 