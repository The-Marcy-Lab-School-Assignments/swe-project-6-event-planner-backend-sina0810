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

module.exports.deleteRsvps = async (rsvp_id) => {
    const query = `
        DELETE FROM rsvps
        WHERE rsvp_id = $1
        RETURNING rsvp_id, user_id, event_id
    `;
    const { rows } = await pool.query(query, [rsvp_id]);
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

