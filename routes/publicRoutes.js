import express from 'express';
import {
  getFAQs_public,
} from '../controllers/faqController.js';
import {
  getAllAnnouncements_public,
  getAnnouncement
} from '../controllers/adminAnnouncementController.js';

import {
  getPublicQueries_public,
} from '../controllers/publicQueryController.js';
import {
  getContactInfo
} from '../controllers/contactController.js';

import {
  postQuery,
  getQueryStatus,
  addFollowUp,
  serveFile,
  handleFileUpload
} from '../controllers/queryController.js';

import upload from '../middleware/upload.js';

const router = express.Router();

// FAQ Routes
router.get('/faqs', getFAQs_public);

// Announcement Routes
router.get('/announcements', getAllAnnouncements_public);
router.get('/announcements/:id', getAnnouncement);


// Query Routes
router.get('/faqs', getFAQs_public);

//query fetching routes
router.post('/queries/post', handleFileUpload, postQuery);
router.get('/queries/status', getQueryStatus);
router.post('/queries/follow-up/:id', handleFileUpload, addFollowUp);
router.get('/queries/file/:filename', serveFile);

//public queries routes
router.get('/public/queries', getPublicQueries_public);

// Contact Routes
router.get('/contact', getContactInfo);

export default router; 