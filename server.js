const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key'; // Change this to a secure key

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files

// Connect to SQLite database
const db = new sqlite3.Database('./waste_management.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    area TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    area TEXT,
    date TEXT,
    time TEXT,
    message TEXT,
    worker_id INTEGER,
    FOREIGN KEY (worker_id) REFERENCES users (id)
  )`);
});

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, password, role, area } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.run(`INSERT INTO users (username, password, role, area) VALUES (?, ?, ?, ?)`, [username, hashedPassword, role, area], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!row) {
      return res.status(400).json({ error: 'User not found' });
    }
    const isValid = await bcrypt.compare(password, row.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ id: row.id, role: row.role, area: row.area }, SECRET_KEY);
    res.json({ token, role: row.role, area: row.area });
  });
});

// Schedule pickup (for workers)
app.post('/schedule', (req, res) => {
  const { area, date, time, message, token } = req.body;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role !== 'worker') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    db.run(`INSERT INTO schedules (area, date, time, message, worker_id) VALUES (?, ?, ?, ?, ?)`, [area, date, time, message, decoded.id], function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Get all schedules
app.get('/schedules', (req, res) => {
  db.all(`SELECT * FROM schedules`, (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get schedules for area
app.get('/schedules/:area', (req, res) => {
  const { area } = req.params;
  db.all(`SELECT * FROM schedules WHERE area = ?`, [area], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});