require('dotenv').config();

const app = require('express')();
const PORT = process.env.PORT || 8080;

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api', (req, res) => {
  res.status(200).send({
    message: 'Hello from JSON',
  });
});

// Error handling
app.use((req, res, next) => {
  res.status(404).json({ message: '404 - Resource not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '500 - Server error' });
});

// Start server
app.listen(
  PORT,
  () => console.log(`Server is running on http://localhost:${PORT}`)
);
