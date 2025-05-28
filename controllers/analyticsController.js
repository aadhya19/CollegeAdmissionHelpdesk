import Query from '../models/Query.js';
import { createObjectCsvWriter } from 'csv-writer';
import PDFDocument from 'pdfkit';

const calculateAverageResolutionTime = (queries) => {
  const resolvedQueries = queries.filter(q => q.status === 'Resolved');
  if (resolvedQueries.length === 0) return 0;

  const totalTime = resolvedQueries.reduce((acc, query) => {
    const resolutionTime = query.updatedAt - query.createdAt;
    return acc + resolutionTime;
  }, 0);

  return totalTime / resolvedQueries.length;
};

const getFastestAndSlowestResolutionTime = (queries) => {
  const resolvedQueries = queries.filter(q => q.status === 'Resolved');
  if (resolvedQueries.length === 0) return { fastest: 0, slowest: 0 };

  const resolutionTimes = resolvedQueries.map(query => 
    query.updatedAt - query.createdAt
  );

  return {
    fastest: Math.min(...resolutionTimes),
    slowest: Math.max(...resolutionTimes)
  };
};

const getQueryTrends = (queries) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const lastTwoWeeks = new Date();
  lastTwoWeeks.setDate(lastTwoWeeks.getDate() - 14);

  const currentWeekQueries = queries.filter(q => q.createdAt >= lastWeek);
  const previousWeekQueries = queries.filter(q => 
    q.createdAt >= lastTwoWeeks && q.createdAt < lastWeek
  );

  const weekOnWeekGrowth = previousWeekQueries.length > 0
    ? ((currentWeekQueries.length - previousWeekQueries.length) / previousWeekQueries.length) * 100
    : 0;

  // Group queries by day for the last 30 days
  const dailyQueries = {};
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dailyQueries[dateStr] = queries.filter(q => 
      q.createdAt.toISOString().split('T')[0] === dateStr
    ).length;
  }

  return {
    weekOnWeekGrowth,
    dailyQueries
  };
};

export const getAnalytics = async (req, res) => {
  try {
    const department = req.session.department;
    const queries = await Query.find({ department });

    // Basic counts
    const totalQueries = queries.length;
    const resolvedQueries = queries.filter(q => q.status === 'Resolved').length;
    const pendingQueries = queries.filter(q => q.status === 'Pending').length;
    const inProgressQueries = queries.filter(q => q.status === 'In Progress').length;

    // Resolution times
    const avgResolutionTime = calculateAverageResolutionTime(queries);
    const { fastest, slowest } = getFastestAndSlowestResolutionTime(queries);

    // Public vs Private breakdown
    const publicQueries = queries.filter(q => q.markedPublic).length;
    const privateQueries = totalQueries - publicQueries;
    const publicConsentQueries = queries.filter(q => q.publicConsent).length;
    const publicConsentPercentage = totalQueries > 0 
      ? (publicConsentQueries / totalQueries) * 100 
      : 0;

    // Follow-up activity
    const queriesWithFollowUps = queries.filter(q => 
      q.conversationHistory && q.conversationHistory.length > 1
    ).length;
    const followUpPercentage = totalQueries > 0
      ? (queriesWithFollowUps / totalQueries) * 100
      : 0;

    // Time-based trends
    const { weekOnWeekGrowth, dailyQueries } = getQueryTrends(queries);

    res.json({
      success: true,
      analytics: {
        // KPI Cards
        totalQueries,
        resolvedQueries,
        pendingQueries,
        inProgressQueries,
        avgResolutionTime,
        fastestResolutionTime: fastest,
        slowestResolutionTime: slowest,

        // Public vs Private
        publicQueries,
        privateQueries,
        publicConsentPercentage,

        // Follow-up Activity
        followUpPercentage,

        // Time-based Trends
        weekOnWeekGrowth,
        dailyQueries
      }
    });
  } catch (error) {
    console.error('Error generating analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating analytics',
      error: error.message
    });
  }
};

export const exportAnalytics = async (req, res) => {
  try {
    const queries = await Query.find();
    const format = req.query.format || 'csv';

    if (format === 'csv') {
      const csvWriter = createObjectCsvWriter({
        path: 'analytics.csv',
        header: [
          { id: 'queryId', title: 'Query ID' },
          { id: 'department', title: 'Department' },
          { id: 'status', title: 'Status' },
          { id: 'createdAt', title: 'Created At' },
          { id: 'updatedAt', title: 'Updated At' },
          { id: 'resolutionTime', title: 'Resolution Time (ms)' }
        ]
      });

      const records = queries.map(query => ({
        queryId: query.queryId,
        department: query.department,
        status: query.status,
        createdAt: query.createdAt,
        updatedAt: query.updatedAt,
        resolutionTime: query.status === 'Resolved' ? 
          (query.updatedAt - query.createdAt) : null
      }));

      await csvWriter.writeRecords(records);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
      res.download('analytics.csv');
    } else if (format === 'pdf') {
      const doc = new PDFDocument();
      const filename = 'analytics.pdf';

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      doc.pipe(res);

      // Add content to PDF
      doc.fontSize(20).text('Query Analytics Report', { align: 'center' });
      doc.moveDown();

      // Add statistics
      doc.fontSize(12).text('Total Queries: ' + queries.length);
      doc.moveDown();

      // Add department statistics
      const departmentStats = queries.reduce((acc, query) => {
        acc[query.department] = (acc[query.department] || 0) + 1;
        return acc;
      }, {});

      doc.text('Queries by Department:');
      Object.entries(departmentStats).forEach(([department, count]) => {
        doc.text(`${department}: ${count}`);
      });

      doc.end();
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid export format'
      });
    }
  } catch (error) {
    console.error('Error exporting analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting analytics',
      error: error.message
    });
  }
}; 