import express from 'express';
import { adminAuth } from '../middlewares/adminAuth.js';
import {
  getFAQs,
  createFAQ,
  getFAQDetails,
  updateFAQ,
  deleteFAQ
} from '../controllers/faqController.js';
import {
  getAllAnnouncements,
  createAnnouncement,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/adminAnnouncementController.js';
import {
  getAllQueries,
  getQueryDetails,
  updateQueryStatus,
  markQueryPublic,
  markQueryPrivate,
  forwardQuery,
  addResponse
} from '../controllers/adminQueryController.js';
import {
  getAnalytics,
  exportAnalytics
} from '../controllers/analyticsController.js';
import {
  updateContactInfo,
  updateCampusMap
} from '../controllers/contactController.js';
import { handleFileUpload } from '../controllers/queryController.js';

import {
  getPublicQueries
} from '../controllers/publicQueryController.js';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// FAQ Management Routes
router.get('/faqs', getFAQs);
router.post('/faqs', createFAQ);
router.get('/faqs/:id', getFAQDetails);
router.put('/faqs/update/:id', updateFAQ);
router.delete('/faqs/delete/:id', deleteFAQ);
  
// Announcement Management Routes
router.get('/announcements', getAllAnnouncements);
router.post('/announcements', createAnnouncement);
router.get('/announcements/:id', getAnnouncement);
router.put('/announcements/update/:id', updateAnnouncement);
router.delete('/announcements/delete/:id', deleteAnnouncement);



//public queries routes
router.get('/public/queries', getPublicQueries);


// Query Management Routes
router.get('/queries', getAllQueries);
router.get('/queries/:id', getQueryDetails);
router.put('/queries/:id/status', updateQueryStatus);
router.put('/queries/:id/public', markQueryPublic);
router.put('/queries/:id/private', markQueryPrivate);
router.post('/queries/forward/:id', forwardQuery);
router.post('/queries/respond/:id', handleFileUpload, addResponse);


// Analytics Management Routes
router.get('/analytics', getAnalytics);
router.get('/analytics/export', exportAnalytics);

// Contact Management Routes
router.put('/contact', updateContactInfo);
router.put('/contact/map', updateCampusMap);

export default router; 