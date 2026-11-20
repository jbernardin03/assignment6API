require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function setup() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing. Check your .env file.');
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await client.query(sql);
  await client.end();

  console.log('Tables created.');
}

setup().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});