const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/get', (req, res) => {
  console.log(req.body);
  res.send('Hello, world!');
});

app.get('/get', (req, res) => {
  res.send('Hello!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});