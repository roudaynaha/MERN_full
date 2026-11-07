import { Router } from 'express';
import mongoose from 'mongoose';
import { protect, requireAdmin } from '../middleware/protect.js';
import Event from '../models/Event.js';
import Feedback from '../models/Feedback.js';

const router = Router();
const authorProjection = 'name email';

router.get('/', async (_request, response, next) => {
  try {
    const events = await Event.find()
      .populate('author', authorProjection)
      .sort({ date: 1, createdAt: -1 });
    return response.json(events);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response.status(400).json({ message: 'Invalid event id.' });
    }

    const event = await Event.findById(request.params.id).populate('author', authorProjection);
    if (!event) {
      return response.status(404).json({ message: 'Event not found.' });
    }

    const feedbacks = await Feedback.find({ event: event._id })
      .populate('author', authorProjection)
      .populate('event', 'title')
      .sort({ createdAt: -1 });
    return response.json({ event, feedbacks });
  } catch (error) {
    return next(error);
  }
});

router.post('/', protect, requireAdmin, async (request, response, next) => {
  try {
    const { title, description, date, location } = request.body;
    if (!title || !description || !date || !location) {
      return response.status(400).json({ message: 'Title, description, date, and location are required.' });
    }

    const event = await Event.create({ title, description, date, location, author: request.member._id });
    await event.populate('author', authorProjection);
    return response.status(201).json(event);
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id', protect, requireAdmin, async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response.status(400).json({ message: 'Invalid event id.' });
    }
    const { title, description, date, location } = request.body;
    if (!title || !description || !date || !location) {
      return response.status(400).json({ message: 'Title, description, date, and location are required.' });
    }

    const event = await Event.findByIdAndUpdate(
      request.params.id,
      { title, description, date, location },
      { new: true, runValidators: true },
    ).populate('author', authorProjection);
    if (!event) return response.status(404).json({ message: 'Event not found.' });
    return response.json(event);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', protect, requireAdmin, async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response.status(400).json({ message: 'Invalid event id.' });
    }

    const event = await Event.findById(request.params.id);
    if (!event) {
      return response.status(404).json({ message: 'Event not found.' });
    }
    await Feedback.deleteMany({ event: event._id });
    await event.deleteOne();
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
