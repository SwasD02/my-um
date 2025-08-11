const express = require('express');
const router = express.Router();    //creatign router object
const rateLimit = require('express-rate-limit');

const {createUser, loginUser} = require('../controllers/userAddController');

const authLimiter = rateLimit(
    {
        windowMs: 10 * 60 * 1000,
        max: 5,
        message: {
            message: "Too many auth attempts, try later after 10 minutes",
            status: 429
        },
        handler: (req, res, next, options) => {
            res.status(options.statusCode).json(options.message);
        }
    }
);

//create a new user
router.post('/register', createUser);
router.post('/login', loginUser);

//router.post('/login', authLimiter, loginUser); DO ADD THE AUTH LIMITER LATER

module.exports = router;