// Writes form submissions directly into the same SQLite file your UiPath project reads from.

const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const DB_PATH = 'C:\\Users\\thina\\OneDrive\\Documents\\UiPath\\Project_PartA\\EnrollmateDB.sqlite';

const db = new Database(DB_PATH);

// Make sure the table exists 
db.exec(`
  CREATE TABLE IF NOT EXISTS Students (
    Name TEXT,
    Age INTEGER,
    Contact TEXT,
    Email TEXT,
    Course TEXT
  );
`);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname))); 

// Handle form submissions
app.post('/submit', (req, res) => {
  const { name, age, contact, email, course } = req.body;

  if (!name || !age || !course) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  const stmt = db.prepare(
    'INSERT INTO Students (Name, Age, Contact, Email, Course) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run(name, age, contact, email, course);

  console.log(`Saved to SQLite: ${name}, age ${age}, ${course}`);
  res.json({ ok: true });
});

// Let the page fetch the current queue too, so the on page list stays accurate
app.get('/students', (req, res) => {
  const rows = db.prepare('SELECT Name, Age, Contact, Email, Course FROM Students').all();
  res.json(rows);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Enrollmate server running — open http://localhost:${PORT} in your browser`);
  console.log(`Writing to database: ${DB_PATH}`);
});