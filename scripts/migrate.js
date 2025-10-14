#!/usr/bin/env node
// Simple migration script: reads sql/supabase_tasks_schema.sql and runs it against DATABASE_URL

const fs = require('fs');
const { Client } = require('pg');
require('dotenv').config();

const sql = fs.readFileSync(require('path').join(__dirname, '..', 'sql', 'supabase_tasks_schema.sql'), 'utf8');
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('Please set DATABASE_URL in your environment (see .env.local.example)');
  process.exit(1);
}

(async () => {
  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    console.log('Connected to database, running migration...');
    await client.query(sql);
    console.log('Migration applied successfully');
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
