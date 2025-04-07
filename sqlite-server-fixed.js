const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// SQLite database (file-based for persistence)
const db = new sqlite3.Database('makaazi.db');

// Initialize database
function initDB() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create tables sequentially
      db.run(`CREATE TABLE IF NOT EXISTS counties (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      )`, (err) => {
        if (err) return reject(err);
        
        db.run(`CREATE TABLE IF NOT EXISTS towns (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          county_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          FOREIGN KEY (county_id) REFERENCES counties(id)
        )`, (err) => {
          if (err) return reject(err);
          
          db.run(`CREATE TABLE IF NOT EXISTS houses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            town_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            deposit TEXT NOT NULL,
            monthly TEXT NOT NULL,
            image TEXT NOT NULL,
            description TEXT,
            FOREIGN KEY (town_id) REFERENCES towns(id)
          )`, (err) => err ? reject(err) : resolve());
        });
      });
    });
  });
}

// Seed data from JSON
function seedData() {
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Start transaction
      db.run('BEGIN TRANSACTION');
      
      // Insert counties
      data.counties.forEach(county => {
        db.run('INSERT OR IGNORE INTO counties VALUES (?, ?)', [county.id, county.name]);
      });
      
      // Insert towns and houses
      data.counties.forEach(county => {
        county.towns.forEach(town => {
          db.run('INSERT INTO towns (county_id, name) VALUES (?, ?)', 
            [county.id, town.name], 
            function(err) {
              if (err) {
                db.run('ROLLBACK');
                return reject(err);
              }
              
              const townId = this.lastID;
              town.houses.forEach(house => {
                db.run(
                  `INSERT INTO houses 
                  (town_id, type, deposit, monthly, image, description) 
                  VALUES (?, ?, ?, ?, ?, ?)`,
                  [
                    townId,
                    house.type,
                    house.deposit,
                    house.monthly,
                    house.image,
                    house.description || `${house.type} in ${town.name}, ${county.name}`
                  ],
                  (err) => {
                    if (err) {
                      db.run('ROLLBACK');
                      return reject(err);
                    }
                  }
                );
              });
            }
          );
        });
      });
      
      // Commit transaction
      db.run('COMMIT', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

// API Endpoints
app.get('/api/counties', (req, res) => {
  db.all('SELECT * FROM counties', (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.get('/api/counties/:id/towns', (req, res) => {
  db.all(
    'SELECT * FROM towns WHERE county_id = ?', 
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({error: err.message});
      res.json(rows);
    }
  );
});

app.get('/api/towns/:id/houses', (req, res) => {
  db.all(
    'SELECT * FROM houses WHERE town_id = ?',
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({error: err.message});
      res.json(rows);
    }
  );
});

// Start server
async function startServer() {
  try {
    console.log('Initializing database...');
    await initDB();
    console.log('Seeding data...');
    await seedData();
    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
}

startServer();