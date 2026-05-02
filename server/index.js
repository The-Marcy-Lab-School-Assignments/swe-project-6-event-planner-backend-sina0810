// Imports / Constants

const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
require('dotenv').config();

const logRoutes = require('./middleware/logRoutes');
const checkAuthentication = require('./middleware/checkAuthentication');
const {
  listUsers,
  updateUser,
  deleteUser,
} = require('./controllers/userControllers');
const {
  createRsvp,
  destroy,
  listByUser,
} = require('./controllers/rsvpControllers');
const {
  listEvent,
  listUserEvents,
  createEvents,
  deleteEvent,
} = require('./controllers/eventControllers');
const {
  register,
  login,
  getMe,
  logout,
} = require('./controllers/authControllers');

const app = express();
const PORT = process.env.PORT || 8080;

// Use dist (requires building the frontend) in production environment
const pathToFrontend =
  process.env.NODE_ENV === 'production' ? '../frontend/dist' : '../frontend';

// Middleware

app.use(logRoutes);
app.use(
  cookieSession({
    name: 'session',
    secret: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000,
  }),
);

app.use(express.json()); // parses requests and stores JSON data in req.body
app.use(express.static(path.join(__dirname, pathToFrontend)));

// Auth routes

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', getMe);
app.delete('/api/auth/logout', logout);

//event routs

app.get('/api/events', listEvent);
app.post('/api/events', checkAuthentication, createEvents);
app.delete('/api/events/:event_id', checkAuthentication, deleteEvent);

// User routes

app.get('/api/users', listUsers);
app.get('/api/users/:user_id/events', listUserEvents);
app.patch('/api/users/:user_id', checkAuthentication, updateUser);
app.delete('/api/users/:user_id', checkAuthentication, deleteUser);

// rsvp routes
app.get('/api/users/:user_id/rsvps', checkAuthentication, listByUser);
app.post('/api/events/:event_id/rsvps', checkAuthentication, createRsvp);
app.delete('/api/events/:event_id/rsvps', checkAuthentication, destroy);

// Notice that this error handler has **four** parameters.
const handleError = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
};
app.use(handleError);

// Listen

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);