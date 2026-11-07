import test from 'node:test';
import assert from 'node:assert/strict';
import Event from '../models/Event.js';
import Feedback from '../models/Feedback.js';
import Member from '../models/Member.js';

test('Member rejects an invalid email', () => {
  const member = new Member({ name: 'Alex', email: 'not-an-email', password: 'hashed-password' });
  const error = member.validateSync();
  assert.ok(error?.errors.email);
});

test('New accounts are students and must opt into membership', () => {
  const member = new Member({ name: 'Alex', email: 'alex@example.com', password: 'hashed-password' });
  assert.equal(member.role, 'STUDENT');
  assert.equal(member.isMember, false);
});

test('Event requires a member author reference', () => {
  const event = new Event({ title: 'Study Session', description: 'A collaborative study session for members.', date: new Date(), location: 'Library' });
  const error = event.validateSync();
  assert.ok(error?.errors.author);
});

test('Feedback rating must be between one and five', () => {
  const feedback = new Feedback({ text: 'Helpful event', rating: 6, event: '507f1f77bcf86cd799439011', author: '507f1f77bcf86cd799439012' });
  const error = feedback.validateSync();
  assert.ok(error?.errors.rating);
});
