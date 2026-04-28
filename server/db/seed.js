const bcrypt = require('bcrypt')
const pool = require('./pool')

const SALT_ROUNT = 8
// /c event_planner_db
const seed = async () => {
    await pool.query('DROP TABLE IF EXISTS rsvps');
    await pool.query('DROP TABLE IF EXISTS events');
    await pool.query('DROP TABLE IF EXISTS users');
    console.log('table dropped')

await pool.query(`
        CREATE TABLE users (
        user_id       SERIAL PRIMARY KEY,
        username      TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
        )
`);
console.log('user table created')

await pool.query(`
    CREATE TABLE events (
        event_id        SERIAL PRIMARY KEY,
        title           TEXT NOT NULL,
        description     TEXT,
        date            DATE NOT NULL,
        event_location  TEXT NOT NULL,
        event_type      TEXT NOT NULL,
        max_capacity    INTEGER NOT NULL,
        user_id         INTEGER REFERENCES users(user_id) ON DELETE CASCADE     
    )
`);

await pool.query(`
        CREATE TABLE rsvps (
            rsvp_id     SERIAL PRIMARY KEY,
            user_id     INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
            event_id    INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
            UNIQUE      (user_id, event_id)
        )
`);
console.log('table created')
    const hashedPassword = await bcrypt.hash('password123', SALT_ROUNT)

    await pool.query(`
            INSERT INTO users (username, password_hash)
            VALUES 
            ('rony_yamal', $1),
            ('rafi_rivera', $1),
            ('ray_debroyn', $1)
            `, [hashedPassword]
        );


    await pool.query(`
            INSERT INTO events (title, description, date, event_location, event_type, max_capacity, user_id)
            VALUES 
            ('5K Morning Run', 'A community morning run through Central Park', '2026-05-01', 'New York', 'sports', 500, 1),
            ('Basketball Tournament', '3v3 basketball tournament with prizes for the winners', '2026-05-02', 'New Jersey', 'sports', 100, 2),
            ('Soccer Pickup Game', 'Casual soccer game open to all skill levels', '2026-05-03', 'Florida', 'sports', 22, 3),
            ('Tennis Open', 'Amateur tennis tournament for all age groups', '2026-05-04', 'New York', 'sports', 64, 1),
            ('Yoga and Swim', 'Morning yoga followed by a group swim session', '2026-05-05', 'New Jersey', 'sports', 30, 2)
        `);

        await pool.query(`
                INSERT INTO rsvps (user_id, event_id)
                VALUES 
                (1, 2),
                (1, 3),
                (2, 1),
                (3, 1),
                (3, 4),
                (2, 5)
            `);
            console.log('table inserted')

            console.log('Connecting to database:', process.env.PG_DATABASE);


};

seed();