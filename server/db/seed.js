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

    const ronyHash = await bcrypt.hash('password123', SALT_ROUNT)
    const rafiHash = await bcrypt.hash('password1234', SALT_ROUNT)
    const rayHash = await bcrypt.hash('password12345', SALT_ROUNT)

  const { rows: users } = await pool.query(`
            INSERT INTO users (username, password_hash)
            VALUES 
            ('rony', $1),
            ('rafi', $2),
            ('ray', $3)
            RETURNING user_id, username
            `, [ronyHash, rafiHash, rayHash]
        );
        
        const [rony, rafi, ray] = users;


     const { rows: events } = await pool.query(`
            INSERT INTO events (title, description, date, event_location, event_type, max_capacity, user_id)
            VALUES 
            ('5K Morning Run', 'A community morning run through Central Park', '2026-05-01', 'New York', 'sports', 500, $1),
            ('Basketball Tournament', '3v3 basketball tournament with prizes for the winners', '2026-05-02', 'New Jersey', 'sports', 100, $2),
            ('Soccer Pickup Game', 'Casual soccer game open to all skill levels', '2026-05-03', 'Florida', 'sports', 22, $3),
            ('Tennis Open', 'Amateur tennis tournament for all age groups', '2026-05-04', 'New York', 'sports', 64, $1),
            ('Yoga and Swim', 'Morning yoga followed by a group swim session', '2026-05-05', 'New Jersey', 'sports', 30, $2)
            RETURNING event_id, title
        `, [rony.user_id, rafi.user_id, ray.user_id]);

        const [run, basketball, soccer, tennis, yoga] = events

        await pool.query(`
                INSERT INTO rsvps (user_id, event_id)
                VALUES 
                ($1, $4),
                ($1, $5),
                ($2, $4),
                ($2, $6),
                ($3, $5),
                ($3, $7)
                `, [
                    rony.user_id,        // $1
                    rafi.user_id,        // $2
                    ray.user_id,         // $3
                    run.event_id,        // $4
                    basketball.event_id, // $5
                    soccer.event_id,     // $6
                    tennis.event_id      // $7
                ]);
            return { users, events };
};

seed()
  .then(({ users, events }) => {
    console.log('Database seeded successfully.');
    console.log(`  Users:     ${users.map((u) => u.username).join(', ')}`);
    console.log(`  events: ${events.map((e) => e.title).join(', ')}`);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
