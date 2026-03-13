import Database from 'better-sqlite3';
import path from 'path';

// Use the existing Coach database
const DB_PATH = '/root/.openclaw/workspace-conductor/memory/coach.db';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH, { readonly: false });
    db.pragma('journal_mode = WAL');
  }
  return db;
}

// Database initialization (run on cold start)
export function initializeDb() {
  const db = getDb();
  // Database already exists with schema, just ensure it's accessible
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Connected to Coach database. Tables:', tables.map((t: any) => t.name));
}
