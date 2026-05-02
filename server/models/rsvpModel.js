const pool = require('../db/pool');

module.exports.create = async (user_id, event_id) => {
    const query = `
       INSERT INTO rsvps (user_id, event_id)
       VALUES ($1, $2)
       RETURNING rsvp_id, user_id, event_id
    `;
    const { rows } = await pool.query(query, [user_id, event_id]);
    return rows[0];
};

module.exports.deleteRsvps = async (user_id, event_id) => {
    const query = `
        DELETE FROM rsvps
        WHERE user_id = $1 AND event_id = $2
        RETURNING rsvp_id, user_id, event_id
    `;
    const { rows } = await pool.query(query, [user_id, event_id]);
    return rows[0] || null;
};

module.exports.listByEvent = async (event_id) => {
    const query = `
        SELECT rsvps.rsvp_id, users.user_id, users.username
        FROM rsvps
        INNER JOIN users ON users.user_id = rsvps.user_id
        WHERE rsvps.event_id = $1
    `;
    const { rows } = await pool.query(query, [event_id]);
    return rows;
};


module.exports.listByUser = async (user_id) => {
    const query = `
        SELECT rsvps.rsvp_id, events.event_id, events.title, events.date, events.location, events.event_type
        FROM rsvps
        INNER JOIN events ON events.event_id = rsvps.event_id
        WHERE rsvps.user_id = $1
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
};