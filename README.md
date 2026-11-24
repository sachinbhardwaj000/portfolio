# Full-Stack Developer Portfolio (MERN)

A responsive portfolio rebuilt with **React, Node.js, Express and MongoDB**, while keeping the original dark developer-console visual style.

## Features
- Responsive React portfolio with dark/light theme preference.
- Projects loaded from MongoDB through a public REST API.
- Contact form validates input and stores messages in MongoDB.
- Protected admin API: login, create/update/delete projects, view/read/delete contact messages.
- JWT authentication, bcrypt password hashing, Helmet security headers, CORS allowlist and rate limiting.
- Original static HTML/CSS/JS implementation remains available on the `main` branch. This MERN version is isolated on `feature/mern-fullstack-portfolio`.

## Stack
React + Vite | HTML5 | CSS3 | JavaScript | Node.js | Express | MongoDB + Mongoose | JWT | bcrypt

## Run locally
1. Install Node.js 20+ and create a MongoDB database (MongoDB Atlas free tier is fine).
2. Copy `server/.env.example` to `server/.env` and set real values. Never commit `.env`.
3. Install packages from the repository root:
   ```bash
   npm install
   ```
4. Start the API and React app:
   ```bash
   npm run dev
   ```
5. Open http://localhost:5173. API health: http://localhost:5000/api/health.

## Create the first admin account
Generate a bcrypt hash locally:
```bash
node --input-type=module -e "import bcrypt from 'bcryptjs'; console.log(await bcrypt.hash(process.argv[1], 12))" "your-strong-password"
```
In MongoDB Compass or Atlas, insert one document into the `admins` collection:
```json
{ "username": "admin", "passwordHash": "PASTE_BCRYPT_HASH_HERE" }
```
Use the same username when signing in through `POST /api/admin/login`. Keep the JWT secret private. Admin routes are ready for a dashboard UI or API client.

## API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API health |
| GET | `/api/projects` | Public project list |
| POST | `/api/contact` | Save a contact message |
| POST | `/api/admin/login` | Get JWT |
| POST | `/api/admin/projects` | Create project (Bearer token) |
| PUT | `/api/admin/projects/:id` | Update project (Bearer token) |
| DELETE | `/api/admin/projects/:id` | Delete project (Bearer token) |
| GET | `/api/admin/messages` | List contact messages (Bearer token) |
| PATCH | `/api/admin/messages/:id/read` | Mark message read |
| DELETE | `/api/admin/messages/:id` | Delete message |

## Production notes
- Set `CLIENT_URL` to the exact deployed frontend origin(s), separated by commas.
- Set `VITE_API_URL` at frontend build time to the deployed API base URL plus `/api`.
- Use HTTPS, a strong random JWT secret, managed MongoDB credentials, and a secure secrets manager.
- Add email notifications if you want contact submissions forwarded to an inbox; current implementation stores them in MongoDB.
- Add an admin dashboard UI and automated tests before calling the project production-complete.
