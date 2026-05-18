# EventSphere — Backend API

Express + MongoDB + Session Auth backend for the EventSphere MERN project.

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Configure environment
Edit `.env` (already created):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventsphere
SESSION_SECRET=eventsphere_super_secret_key_change_in_production
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
Make sure **MongoDB Compass** is running locally on port 27017.

### 3. Start the server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## 📁 Project Structure

```
server/
├── server.js                  ← Entry point
├── .env                       ← Environment variables
├── package.json
├── config/                    ← (reserved for future DB config helpers)
├── models/
│   ├── User.js                ← admin | exhibitor | attendee
│   ├── Event.js               ← Events with category, dates, tickets
│   ├── Booth.js               ← Exhibitor booths (pending/approved)
│   ├── Booking.js             ← Attendee event bookings
│   ├── Ticket.js              ← Support tickets
│   ├── Message.js             ← User-to-user messages
│   ├── Schedule.js            ← Admin schedule / calendar tasks
│   └── Contact.js             ← Public contact form submissions
├── controllers/               ← Business logic
├── routes/                    ← Route definitions
└── middleware/
    ├── auth.middleware.js     ← isAuthenticated, authorizeRoles
    └── upload.middleware.js   ← Multer image uploads (5MB limit)
```

---

## 🔐 Authentication

Session-based using `express-session` + `connect-mongo`.

| Method | Endpoint           | Access  | Description              |
|--------|--------------------|---------|--------------------------|
| POST   | /api/auth/register | Public  | Register new user        |
| POST   | /api/auth/login    | Public  | Login + create session   |
| POST   | /api/auth/logout   | Public  | Destroy session          |
| GET    | /api/auth/me       | Private | Get current session user |

**Register body:**
```json
{
  "name": "Ali Khan",
  "email": "ali@gmail.com",
  "password": "secret123",
  "role": "attendee",        // "admin" | "exhibitor" | "attendee"
  "phone": "+92300000000",   // optional
  "company": "TechNova"      // optional (required for exhibitor/admin)
}
```

**Login body:**
```json
{ "email": "ali@gmail.com", "password": "secret123" }
```

---

## 👤 Users `/api/users`

| Method | Endpoint                  | Access        | Description          |
|--------|---------------------------|---------------|----------------------|
| GET    | /                         | Admin         | Get all users        |
| GET    | /?role=attendee           | Admin         | Filter by role       |
| GET    | /:id                      | Authenticated | Get user by ID       |
| DELETE | /:id                      | Admin         | Delete user          |
| PUT    | /profile/update           | Authenticated | Update profile + avatar (multipart/form-data) |
| PUT    | /profile/password         | Authenticated | Change password      |

---

## 🎪 Events `/api/events`

| Method | Endpoint          | Access  | Description           |
|--------|-------------------|---------|-----------------------|
| GET    | /                 | Public  | Get all events        |
| GET    | /?category=Tech   | Public  | Filter by category    |
| GET    | /?search=expo     | Public  | Search by title       |
| GET    | /:id              | Public  | Get single event      |
| GET    | /admin/stats      | Admin   | Dashboard stats       |
| POST   | /                 | Admin   | Create event          |
| PUT    | /:id              | Admin   | Update event          |
| DELETE | /:id              | Admin   | Delete event          |

**Create/Update event body** (multipart/form-data if uploading `coverImage`):
```
title, description, category, location, startDate, endDate,
ticketPrice, maxAttendees, tags (comma-separated), coverImage (file)
```

---

## 🏗️ Booths `/api/booths`

| Method | Endpoint          | Access     | Description              |
|--------|-------------------|------------|--------------------------|
| GET    | /                 | Public     | Get all booths           |
| GET    | /:id              | Public     | Get booth by ID          |
| GET    | /my/booths        | Exhibitor  | Get my booths            |
| POST   | /                 | Exhibitor  | Create booth (→ pending) |
| PUT    | /:id              | Exhibitor  | Update own booth         |
| DELETE | /:id              | Exhibitor/Admin | Delete booth        |
| PATCH  | /:id/status       | Admin      | Approve / Reject booth   |

---

## 🎟️ Bookings `/api/bookings`

| Method | Endpoint          | Access    | Description                   |
|--------|-------------------|-----------|-------------------------------|
| POST   | /                 | Attendee  | Book an event                 |
| GET    | /my               | Attendee  | My bookings                   |
| PATCH  | /:id/cancel       | Attendee  | Cancel own booking            |
| GET    | /                 | Admin     | All bookings                  |
| PATCH  | /:id/status       | Admin     | Approve / Reject booking      |

**Book event body:**
```json
{ "eventId": "...", "sessionTitle": "AI Talk", "sessionTime": "10:00 AM", "hallLocation": "Hall A" }
```

---

## 🎫 Tickets `/api/tickets`

| Method | Endpoint          | Access | Description              |
|--------|-------------------|--------|--------------------------|
| POST   | /                 | Auth   | Create support ticket    |
| GET    | /my               | Auth   | My tickets               |
| GET    | /                 | Admin  | All tickets              |
| PATCH  | /:id/status       | Admin  | Update ticket status     |
| DELETE | /:id              | Admin  | Delete ticket            |

---

## 💬 Messages `/api/messages`

| Method | Endpoint                  | Access | Description               |
|--------|---------------------------|--------|---------------------------|
| POST   | /                         | Auth   | Send a message            |
| GET    | /inbox                    | Auth   | My inbox (unique chats)   |
| GET    | /conversation/:userId     | Auth   | Conversation with a user  |
| GET    | /all                      | Admin  | All messages              |

**Send message body:**
```json
{ "receiverId": "...", "text": "Hello!" }
```

---

## 📅 Schedule `/api/schedule`

| Method | Endpoint  | Access | Description          |
|--------|-----------|--------|----------------------|
| GET    | /         | Auth   | All schedules        |
| GET    | /?date=2026-05-14 | Auth | By date       |
| POST   | /         | Admin  | Create schedule item |
| PUT    | /:id      | Admin  | Update item          |
| DELETE | /:id      | Admin  | Delete item          |

---

## 📨 Contact `/api/contact`

| Method | Endpoint      | Access | Description             |
|--------|---------------|--------|-------------------------|
| POST   | /             | Public | Submit contact form     |
| GET    | /             | Admin  | All submissions         |
| PATCH  | /:id/read     | Admin  | Mark as read            |
| DELETE | /:id          | Admin  | Delete submission       |

---

## 🔗 Frontend Integration

In your React files, replace static data and `alert()` calls with `fetch` calls like:

```js
// Login example
const res = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",      // ← required for sessions
  body: JSON.stringify({ email, password }),
});
const data = await res.json();
```

> Always include `credentials: "include"` in every request so the session cookie is sent.

---

## 🗄️ MongoDB Collections

After running, Compass will show these collections in the `eventsphere` database:
- `users`
- `events`
- `booths`
- `bookings`
- `tickets`
- `messages`
- `schedules`
- `contacts`
- `sessions` (auto-managed by connect-mongo)
