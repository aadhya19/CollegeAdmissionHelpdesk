import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '../../styles/AnalyticsDashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalQueries: 0,
    resolvedQueries: 0,
    pendingQueries: 0,
    inProgressQueries: 0,
    avgResolutionTime: 0,
    fastestResolutionTime: 0,
    slowestResolutionTime: 0,
    publicQueries: 0,
    privateQueries: 0,
    publicConsentPercentage: 0,
    followUpPercentage: 0,
    weekOnWeekGrowth: 0,
    dailyQueries: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/analytics', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        setAnalytics(data.analytics);
      } else {
        setError(data.message || 'Failed to fetch analytics data');
      }
    } catch (error) {
      setError('An error occurred while fetching analytics data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / (1000 * 60));
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatPercentage = (value) => {
    return `${Math.round(value)}%`;
  };

  // Chart data for query trends
  const queryTrendsData = {
    labels: Object.keys(analytics.dailyQueries).reverse(),
    datasets: [{
      label: 'Queries per Day',
      data: Object.values(analytics.dailyQueries).reverse(),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  // Chart data for public vs private queries
  const publicPrivateData = {
    labels: ['Public', 'Private'],
    datasets: [{
      data: [analytics.publicQueries, analytics.privateQueries],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading analytics data...</div>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="analytics-dashboard">
      <div className="header">
        <h1>Analytics Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Queries</h3>
          <div className="stat-value">{analytics.totalQueries}</div>
        </div>

        <div className="stat-card">
          <h3>Resolved Queries</h3>
          <div className="stat-value">{analytics.resolvedQueries}</div>
        </div>

        <div className="stat-card">
          <h3>Pending Queries</h3>
          <div className="stat-value">{analytics.pendingQueries}</div>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <div className="stat-value">{analytics.inProgressQueries}</div>
        </div>

        <div className="stat-card">
          <h3>Avg Resolution Time</h3>
          <div className="stat-value">{formatTime(analytics.avgResolutionTime)}</div>
        </div>

        <div className="stat-card">
          <h3>Fastest Resolution</h3>
          <div className="stat-value">{formatTime(analytics.fastestResolutionTime)}</div>
        </div>

        <div className="stat-card">
          <h3>Slowest Resolution</h3>
          <div className="stat-value">{formatTime(analytics.slowestResolutionTime)}</div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Query Trends (Last 30 Days)</h3>
          <div className="chart-container">
            <Line data={queryTrendsData} options={chartOptions} />
          </div>
          <div className="trend-info">
            <span className="trend-label">Week-on-Week Growth:</span>
            <span className={`trend-value ${analytics.weekOnWeekGrowth >= 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(analytics.weekOnWeekGrowth)}
            </span>
          </div>
        </div>

        <div className="side-by-side-charts">
          <div className="chart-card">
            <h3>Public vs Private Queries</h3>
            <div className="chart-container">
              <Doughnut data={publicPrivateData} options={chartOptions} />
            </div>
            <div className="chart-info">
              <p>Public Consent Rate: {formatPercentage(analytics.publicConsentPercentage)}</p>
            </div>
          </div>

          <div className="chart-card">
            <h3>Follow-up Activity</h3>
            <div className="follow-up-indicator">
              <div className="follow-up-circle">
                <div className="follow-up-value">
                  {formatPercentage(analytics.followUpPercentage)}
                </div>
                <div className="follow-up-label">of queries received follow-ups</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 