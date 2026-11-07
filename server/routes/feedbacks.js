import { Router } from 'express';
import mongoose from 'mongoose';
import { protect, requireMembership } from '../middleware/protect.js';
import Event from '../models/Event.js';
import Feedback from '../models/Feedback.js';

const router = Router();
const authorProjection = 'name email';

router.get('/', async (request, response, next) => {
  try {
    const filter = request.query.event ? { event: request.query.event } : {};
    if (request.query.event && !mongoose.isValidObjectId(request.query.event)) {
      return response.status(400).json({ message: 'Invalid event id.' });
    }

    const feedbacks = await Feedback.find(filter)
      .populate('author', authorProjection)
      .populate('event', 'title')
      .sort({ createdAt: -1 });
    return response.json(feedbacks);
  } catch (error) {
    return next(error);
  }
});

router.post('/', protect, requireMembership, async (request, response, next) => {
  try {
    const { text, rating, event: eventId } = request.body;
    if (!text || !rating || !eventId) {
      return response.status(400).json({ message: 'Text, rating, and event are required.' });
    }
    if (!mongoose.isValidObjectId(eventId)) {
      return response.status(400).json({ message: 'Invalid event id.' });
    }
    if (!await Event.exists({ _id: eventId })) {
      return response.status(404).json({ message: 'Event not found.' });
    }

    const feedback = await Feedback.create({ text, rating, event: eventId, author: request.member._id });
    await feedback.populate([{ path: 'author', select: authorProjection }, { path: 'event', select: 'title' }]);
    return response.status(201).json(feedback);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', protect, async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response.status(400).json({ message: 'Invalid feedback id.' });
    }
    const feedback = await Feedback.findById(request.params.id);
    if (!feedback) {
      return response.status(404).json({ message: 'Feedback not found.' });
    }
    if (feedback.author.toString() !== request.member._id.toString()) {
      return response.status(403).json({ message: 'You can delete only your own feedback.' });
    }

    await feedback.deleteOne();
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
