const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });


const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
  

 });

module.exports = pool;
