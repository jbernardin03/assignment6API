require('dotenv').config();
const express = require('express');
const triviaRouter = require('./routes/triviaRouter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/triviabook', triviaRouter);

// Malformed JSON body handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  next(err);
});

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Triviabook API running at http://localhost:${PORT}/triviabook`);
});