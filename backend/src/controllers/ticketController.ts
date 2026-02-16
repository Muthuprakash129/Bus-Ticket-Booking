import { Response } from 'express';
import { validationResult } from 'express-validator';
import { Ticket } from '../models/Ticket';
import { AuthRequest } from '../middleware/auth';

export const bookTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    const { passengerName, route, seatNumber, departureTime, fare } = req.body;
    const userId = req.user!.userId;

    const existing = await Ticket.findOne({
      route,
      seatNumber,
      departureTime: new Date(departureTime),
      status: 'BOOKED',
    });
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'This seat is already booked for the selected route and departure time.',
      });
      return;
    }

    const ticket = await Ticket.create({
      passengerName,
      route,
      seatNumber,
      departureTime: new Date(departureTime),
      fare: Number(fare),
      status: 'BOOKED',
      bookingTimestamp: new Date(),
      bookedBy: userId,
    });
    const populated = await Ticket.findById(ticket._id).select('-__v').lean();
    res.status(201).json({ success: true, ticket: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Booking failed' });
  }
};

export const getAllTickets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = await Ticket.find().sort({ bookingTimestamp: -1 }).lean();
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
  }
};

export const getTicketsByRoute = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    const route = req.query.route as string;
    const tickets = await Ticket.find({ route }).sort({ bookingTimestamp: -1 }).lean();
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
  }
};

export const getTicketsSortedByDate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = await Ticket.find().sort({ bookingTimestamp: -1 }).lean();
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
  }
};

export const cancelTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
      return;
    }
    if (ticket.status !== 'BOOKED') {
      res.status(400).json({
        success: false,
        message: 'Only BOOKED tickets can be cancelled.',
      });
      return;
    }
    ticket.status = 'CANCELLED';
    await ticket.save();
    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Cancellation failed' });
  }
};

export const getStatistics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [booked, cancelled, completed] = await Promise.all([
      Ticket.countDocuments({ status: 'BOOKED' }),
      Ticket.countDocuments({ status: 'CANCELLED' }),
      Ticket.countDocuments({ status: 'COMPLETED' }),
    ]);
    const totalRevenue = await Ticket.aggregate([
      { $match: { status: 'BOOKED' } },
      { $group: { _id: null, total: { $sum: '$fare' } } },
    ]);
    const revenue = totalRevenue[0]?.total ?? 0;
    const totalTickets = booked + cancelled + completed;
    res.json({
      success: true,
      statistics: {
        totalRevenue: revenue,
        totalTickets,
        booked,
        cancelled,
        completed,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
};
