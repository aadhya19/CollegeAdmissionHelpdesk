import express from 'express';
import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getFAQDetails
} from '../controllers/faqController.js';

const router = express.Router();

// Public routes
router.get('/', getFAQs);

// Protected routes (admin only)
router.post('/create', createFAQ);
router.put('/:id', getFAQDetails);
// router.put('/:id', updateFAQ);
// router.delete('/:id', deleteFAQ);

export default router; 