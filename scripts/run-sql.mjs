#!/usr/bin/env node
/**
 * Applies a .sql file to the Supabase Postgres database.
 *
 * Usage:
 *   node --env-file-if-exists=/vercel/share/.env.project \
 *        scripts/run-sql.mjs supabase/migrations/0001_init.sql
 */
import { readFileSync } from "node:fs";
import pg from "pg";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/run-sql.mjs <path-to-sql-file>");
  process.exit(1);
}

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("Missing POSTGRES_URL_NON_POOLING / POSTGRES_URL");
  process.exit(1);
}

// Supabase pooler URLs carry `sslmode=require`, which recent pg versions treat
// as `verify-full`. That rejects Supabase's self-signed chain, so strip the
// param and configure TLS explicitly instead.
const url = new URL(connectionString);
url.searchParams.delete("sslmode");
url.searchParams.delete("ssl");

const sql = readFileSync(file, "utf8");
const client = new pg.Client({
  connectionString: url.toString(),
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log(`Applied ${file}`);
} catch (err) {
  console.error(`Failed to apply ${file}`);
  console.error(err.message);
  if (err.position) console.error("at character position", err.position);
  process.exitCode = 1;
} finally {
  await client.end();
}
