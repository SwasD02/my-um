const express = require ('express');
const mongoose = require('mongoose');

require('dotenv').config();
const PORT = process.env.PORT || 3005;

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
		.then(() => {listenAPP}) 
 		.catch((err) => { console.log(err) });  

app.get('/userpage', (req, res) => {
  res.send('Hello from backend');
});

app.get('/api/events', (req, res) => {
  res.json({message: 'events endpoint hit'});
});


const listenAPP = app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});