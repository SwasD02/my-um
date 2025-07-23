const express = require ('express');

require('dotenv').config();
const PORT = process.env.PORT || 3005;

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from backend');
});

app.get('/api/events', (req, res) => {
  res.json({message: 'events endpoint hit'});
});


app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});