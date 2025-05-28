import express from 'express';
import { 
  getQueries, 
  getAllQueries, 
  getQueryDetails, 
  updateQueryStatus, 
  addResponse,
  markQueryPublic,
  markQueryPrivate,
  forwardQuery
} from '../controllers/adminQueryController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// ... existing routes ...

// Update the response route to handle file uploads
router.post('/queries/:id/response', upload.array('files'), addResponse);

// ... existing routes ...

export default router; 