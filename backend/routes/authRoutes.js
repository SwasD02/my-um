const express = require('express');
const router = express.Router();    //creatign router object
const rateLimit = require('express-rate-limit');

const {createUser} = require('../controllers/userAddController');

const authLimiter = rateLimit(
    {
        windowMs: 15 * 60 * 1000,
        max: 2,
        message: {
            message: "Too many auth attempts, try later after 15 minutes",
            status: 429
        },
        handler: (req, res, next, options) => {
            res.status(options.statusCode).json(options.message);
        }
    }
);

//create a new user
router.post('/register', authLimiter, createUser);

module.exports = router;