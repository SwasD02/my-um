const express = require('express');
const router = express.Router();    //creatign router object

const {
  createNewEvent,
  getAllUserEvents,
  getUserEvent,
  getTotalUserEvents,
  delEvent,
  delUser
} = require('../controllers/userAddController');

//GET all user events for a particular date
router.get('/events', getAllUserEvents);

//GET total user events
router.get('/events/all', getTotalUserEvents);

//GET a particular user event
router.get('/events/:id', getUserEvent);

//create a new user event
router.post('/events', createNewEvent);

//DEL an user
router.delete('/:id', delUser);

//DEL an event of an user
router.delete('/events/:id', delEvent);

module.exports = router;




