# Student Club Hub

Campus Éclat is a MERN single-page application for a student association. Visitors can browse events and their feedback. Students can create an account, become members, and then leave feedback. Only administrators can create, edit, or delete events.

## Features

- `Member`, `Event`, and `Feedback` Mongoose models.
- One member can author many events; one event can have many feedback entries.
- Related members and events are displayed with Mongoose `populate()`.
- bcrypt password hashing, JWT login, and a `protect` middleware.
- Server-side role guards: only `ADMIN` can create, edit, or delete events.
- Students are registered only as `STUDENT`; membership is activated from the profile page before feedback can be posted.
- React 18 + Vite SPA, React Router, controlled forms, hooks, AuthContext, `localStorage`, and an Axios JWT interceptor.
- Visitor read-only mode; member-only add/delete controls.

## Local setup

Prerequisites: Node.js 20+ and a MongoDB Atlas database.

1. Copy `server/.env.example` to `server/.env` and set fresh values for `MONGO_URI` and `JWT_SECRET`.
2. Copy `client/.env.example` to `client/.env` and set `VITE_API_URL=http://localhost:5000/api`.
3. Install dependencies:

   ```bash
   npm run install:all
   npm install
   ```

4. Run both apps:

   ```bash
   npm run dev
   ```

   The API listens on `http://localhost:5000`; Vite serves the client on `http://localhost:5173`.

5. Create the initial administrator after the MongoDB connection is configured:

   ```bash
   npm --prefix server run seed:admin -- admin@example.com AStrongPassword "Campus Admin"
   ```

5. Validate production client output:

   ```bash
   npm run build
   ```

## API

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a member and receive a JWT |
| POST | `/api/auth/login` | Public | Log in and receive a JWT |
| GET | `/api/auth/me` | Authenticated | Read current profile |
| PATCH | `/api/auth/membership` | Authenticated | Become a member |
| GET | `/api/events` | Public | List events with authors |
| GET | `/api/events/:id` | Public | Get an event and its feedback |
| POST | `/api/events` | Admin | Create an event |
| PATCH | `/api/events/:id` | Admin | Edit an event |
| DELETE | `/api/events/:id` | Admin | Delete an event and its feedback |
| GET | `/api/feedbacks?event=:id` | Public | List feedback for an event |
| POST | `/api/feedbacks` | Member | Add feedback |
| DELETE | `/api/feedbacks/:id` | Owner | Delete feedback |

Send `Authorization: Bearer <token>` for protected endpoints.

## Deployment

### MongoDB Atlas

Create an M0 cluster and database user, allow the deployment service IP addresses, then set its URI as `MONGO_URI` in Render. Never commit this URI.

### Render (API)

1. Create a Render web service from this repository, using `server` as the root directory.
2. Build command: `npm ci`; start command: `npm start`.
3. Configure `MONGO_URI`, a newly generated `JWT_SECRET`, and `CLIENT_URL` (the Vercel URL).
4. Confirm `https://<render-service>/api/health` returns `{ "status": "ok" }`.

`render.yaml` contains equivalent blueprint settings.

### Vercel (client)

1. Import the repository and set the root directory to `client`.
2. Vercel detects Vite; build command is `npm run build` and output directory is `dist`.
3. Set `VITE_API_URL=https://<render-service>/api`.
4. Redeploy Render after setting `CLIENT_URL` to the Vercel deployment URL.

## Security note

If an Atlas connection string or database password was ever pasted into chat, logs, source code, or Git history, rotate that database user's password before using this project or deploying it.
