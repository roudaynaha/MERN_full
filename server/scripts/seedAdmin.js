import 'dotenv/config';
import bcrypt from 'bcryptjs';
import Member from '../models/Member.js';
import { connectDatabase } from '../server.js';

const [email, password, ...nameParts] = process.argv.slice(2);
const name = nameParts.join(' ') || 'Campus Administrator';

if (!email || !password) {
  console.error('Usage: npm run seed:admin -- <email> <password> [name]');
  process.exit(1);
}

await connectDatabase();
const passwordHash = await bcrypt.hash(password, 12);
const member = await Member.findOneAndUpdate(
  { email: email.toLowerCase().trim() },
  { name, password: passwordHash, role: 'ADMIN', isMember: true },
  { upsert: true, new: true, setDefaultsOnInsert: true },
);
console.log(`Administrator ready: ${member.email}`);
process.exit(0);
