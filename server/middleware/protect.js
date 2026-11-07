import jwt from 'jsonwebtoken';
import Member from '../models/Member.js';

export async function protect(request, response, next) {
  const [scheme, token] = (request.headers.authorization || '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const member = await Member.findById(decoded.memberId).select('-password');

    if (!member) {
      return response.status(401).json({ message: 'Member account no longer exists.' });
    }

    request.member = member;
    return next();
  } catch {
    return response.status(401).json({ message: 'Invalid or expired token.' });
  }
}

export function requireAdmin(request, response, next) {
  if (request.member?.role !== 'ADMIN') {
    return response.status(403).json({ message: 'Administrator access is required.' });
  }
  return next();
}

export function requireMembership(request, response, next) {
  if (request.member?.role === 'ADMIN' || request.member?.isMember) {
    return next();
  }
  return response.status(403).json({ message: 'Become a member before sharing feedback.' });
}
