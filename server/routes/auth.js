import bcrypt from 'bcryptjs';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Member from '../models/Member.js';
import { protect } from '../middleware/protect.js';

const router = Router();

function createToken(memberId) {
  return jwt.sign({ memberId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function publicMember(member) {
  return {
    id: member._id,
    name: member.name,
    email: member.email,
    role: member.role,
    isMember: member.isMember,
  };
}

function authPayload(member) {
  return {
    token: createToken(member._id.toString()),
    member: publicMember(member),
  };
}

router.post('/register', async (request, response, next) => {
  try {
    const { name, email, password } = request.body;
    if (!name || !email || !password) {
      return response.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingMember = await Member.findOne({ email: email.toLowerCase().trim() });
    if (existingMember) {
      return response.status(409).json({ message: 'An account already uses this email.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const member = await Member.create({ name, email, password: passwordHash, role: 'STUDENT' });
    return response.status(201).json(authPayload(member));
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({ message: 'Email and password are required.' });
    }

    const member = await Member.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!member || !(await bcrypt.compare(password, member.password))) {
      return response.status(401).json({ message: 'Invalid email or password.' });
    }

    return response.json(authPayload(member));
  } catch (error) {
    return next(error);
  }
});

router.get('/me', protect, (request, response) => response.json({ member: publicMember(request.member) }));

router.patch('/membership', protect, async (request, response, next) => {
  try {
    if (request.member.role !== 'ADMIN' && !request.member.isMember) {
      request.member.isMember = true;
      await request.member.save();
    }
    return response.json({ member: publicMember(request.member) });
  } catch (error) {
    return next(error);
  }
});

export default router;
