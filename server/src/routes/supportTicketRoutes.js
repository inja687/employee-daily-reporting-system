import express from 'express';
import {
  createPublicTicket,
  createCompanyTicket,
  getCompanyTickets,
  getAllTicketsSuperAdmin,
  getTicketById,
  addReply,
  addInternalNote,
  submitTicketRating,
  updateTicketStatus,
  reopenTicket,
  deleteTicket,
} from '../controllers/supportTicketController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { enforceTenantIsolation } from '../middleware/tenantMiddleware.js';

const router = express.Router();

// 1. Public Endpoint for Landing Page Contact Us Form
router.post('/public', createPublicTicket);

// 2. Company Admin Help Desk Endpoints
router.use('/company', protect, authorize('Company Admin'), enforceTenantIsolation);
router.route('/company').get(getCompanyTickets).post(createCompanyTicket);
router.post('/company/:id/reply', addReply);
router.post('/company/:id/reopen', reopenTicket);
router.post('/company/:id/rate', submitTicketRating);

// 3. Super Admin Platform Customer Support Endpoints
router.use('/admin', protect, authorize('Super Admin'));
router.get('/admin', getAllTicketsSuperAdmin);
router.get('/admin/:id', getTicketById);
router.post('/admin/:id/reply', addReply);
router.post('/admin/:id/note', addInternalNote);
router.patch('/admin/:id/status', updateTicketStatus);
router.delete('/admin/:id', deleteTicket);

export default router;
