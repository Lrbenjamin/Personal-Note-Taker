const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API Routes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes:', err);
      res.status(500).send('Error reading notes');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = { ...req.body, id: uuidv4() };
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes:', err);
      res.status(500).send('Error reading notes');
    } else {
      const notes = JSON.parse(data);
      notes.push(newNote);
      fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
        if (err) {
          console.error('Error saving note:', err);
          res.status(500).send('Error saving note');
        } else {
          res.json(newNote);
        }
      });
    }
  });
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading notes:', err);
        res.status(500).send('Error reading notes');
      } else {
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== req.params.id);
        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
          if (err) {
            console.error('Error deleting note:', err);
            res.status(500).send('Error deleting note');
          } else {
            res.sendStatus(204);
          }
        });
      }
    });
});
  

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

