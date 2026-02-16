import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  bookTicket,
  getAllTickets,
  getTicketsByRoute,
  getTicketsSortedByDate,
  cancelTicket,
  getStatistics,
} from '../controllers/ticketController';
import {
  bookTicketValidation,
  cancelTicketValidation,
  byRouteValidation,
} from '../validate/ticketValidate';

const router = Router();

router.use(authenticate);

router.post('/book', bookTicketValidation, bookTicket);
router.get('/all', getAllTickets);
router.get('/byRoute', byRouteValidation, getTicketsByRoute);
router.get('/sortedByDate', getTicketsSortedByDate);
router.put('/cancel/:id', cancelTicketValidation, cancelTicket);
router.get('/statistics', getStatistics);

export default router;
