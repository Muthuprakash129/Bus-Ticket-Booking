import { body, param, query } from 'express-validator';

export const bookTicketValidation = [
  body('passengerName').trim().notEmpty().withMessage('Passenger name is required'),
  body('route').trim().notEmpty().withMessage('Route is required'),
  body('seatNumber').trim().notEmpty().withMessage('Seat number is required'),
  body('departureTime').isISO8601().withMessage('Valid departure time is required'),
  body('fare').isFloat({ min: 0.01 }).withMessage('Fare must be a positive number'),
];

export const cancelTicketValidation = [
  param('id').isMongoId().withMessage('Valid ticket ID is required'),
];

export const byRouteValidation = [
  query('route').trim().notEmpty().withMessage('Route query is required'),
];
