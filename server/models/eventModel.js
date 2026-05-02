const bcrypt = require('bcrypt');
const pool = require('../db/pool');

const SALT_ROUNDS = 8;

module.exports.list = async () => {
  const query = `
        SELECT events.event_id,
        events.title,
        events.description, 
        events.date, 
        events.location, 
        events.event_type, 
        events.max_capacity, 
        events.user_id, 
        users.username
        FROM events
        INNER JOIN users ON users.user_id = events.user_id
        ORDER BY events.event_id
        `;
  const { rows } = await pool.query(query);
  return rows;
};

module.exports.listByUser = async (user_id) => {
  const query = `
        SELECT event_id, title, description, date, location, event_type, max_capacity, user_id
        FROM events
        WHERE user_id = $1
         `;
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

module.exports.create = async (
  user_id,
  title,
  description,
  date,
  location,
  event_type,
  max_capacity,
) => {
  const query = `
        INSERT INTO events (user_id, title, description, date, location, event_type, max_capacity)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
  const { rows } = await pool.query(query, [
    user_id,
    title,
    description,
    date,
    location,
    event_type,
    max_capacity,
  ]);
  return rows[0];
};

module.exports.find = async (event_id) => {
  const query = `
        SELECT event_id,
        title, 
        description, 
        date,
        location,
        event_type, 
        max_capacity,
        user_id
        FROM events
        WHERE event_id = $1
    `;
  const { rows } = await pool.query(query, [event_id]);
  return rows[0] || null;
};

module.exports.update = async (
  event_id,
  title,
  description,
  date,
  location,
  event_type,
  max_capacity,
) => {
  const query = `
        UPDATE events
        SET 
        title = $1,
        description = $2,
        date = $3,
        location = $4,
        event_type = $5,
        max_capacity = $6
        WHERE event_id = $7
        RETURNING event_id, title, description, date, location, event_type, max_capacity
    `;
  const { rows } = await pool.query(query, [
    title,
    description,
    date,
    location,
    event_type,
    max_capacity,
    event_id,
  ]);
  return rows[0] || null;
};

module.exports.destroy = async (event_id) => {
  const query = `
        DELETE FROM events
        WHERE event_id = $1
    `;
  await pool.query(query, [event_id]);
};
