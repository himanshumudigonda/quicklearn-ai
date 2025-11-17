import * as SQLite from 'expo-sqlite';

let db;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync('quicklearn.db');
  
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    );
  `);
}

export async function saveFavorite(topic, content) {
  await db.runAsync(
    'INSERT INTO favorites (topic, content, timestamp) VALUES (?, ?, ?)',
    [topic, JSON.stringify(content), Date.now()]
  );
}

export async function removeFavorite(topic) {
  await db.runAsync('DELETE FROM favorites WHERE topic = ?', [topic]);
}

export async function getFavorites() {
  const result = await db.getAllAsync('SELECT * FROM favorites ORDER BY timestamp DESC');
  return result.map((row) => ({
    ...row,
    content: JSON.parse(row.content),
  }));
}

export async function cacheExplanation(topic, content) {
  await db.runAsync(
    'INSERT OR REPLACE INTO cache (topic, content, timestamp) VALUES (?, ?, ?)',
    [topic, JSON.stringify(content), Date.now()]
  );
}

export async function getCachedExplanation(topic) {
  const result = await db.getFirstAsync(
    'SELECT * FROM cache WHERE topic = ?',
    [topic]
  );
  
  if (result) {
    return JSON.parse(result.content);
  }
  return null;
}
