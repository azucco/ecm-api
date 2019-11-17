const dotenv = require('dotenv');
dotenv.config();
const { Pool } = require('pg')

const connection = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PW,
  port: 5432,
  ssl: true
})

module.exports = connection;