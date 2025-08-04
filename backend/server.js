const express = require ('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const verifyAuth = require('./middleware/verifyAuth');
const autoSuggest = require('./middleware/autoSuggest');

require('dotenv').config();
const PORT = process.env.PORT || 3005;

const app = express();
app.use(express.json());

app.set('trust proxy', true);         //NOT MUCH IDEA, but this will take requests from the user's IP instead of our proxy frontend

const listenAPP = app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});

mongoose.connect(process.env.MONGO_URI)
		.then(() => {listenAPP}) 
 		.catch((err) => { console.log(err) });  

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      message: "Too many requests from this id, please try again later after 15 mins",
      status: 429
    },
    handler: (req, res, next, options) => {     //executes if out of limit
      res.status(options.statusCode).json(options.message);
    }
});

app.use(globalLimiter);   //next() is internally called in globalLimiter

app.use('/api/auth', authRoutes);
app.use('/api/users', verifyAuth, userRoutes);
app.use('/api/locIQ', autoSuggest);

