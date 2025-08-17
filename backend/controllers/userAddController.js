const UserData = require("../models/userData");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

//JWT code
const JWT_code = process.env.JWT_SECRET;
const SALT = 10;

//POST (Create) an user
const createUser = async(req, res) => {
    try{
        const {username, password} = req.body;
        if(!username || !password) return res.status(400).json({error: "username/pwd not found"});

        const user = await UserData.findOne({username : username});
        if(user) return res.status(409).json({error: "Sorry, user already exists!"});

        const hashedPwd = await bcrypt.hash(password, SALT);

        const newUser = await UserData.create({username: username, password: hashedPwd});

        const jwtTok  = jwt.sign(
          { userID: newUser._id, username: newUser.username },    //This is payload
          JWT_code,
          { expiresIn: "2h" }
        );

        res.cookie('token', jwtTok, {
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7200000, 
        });
        
        res.status(201).json({message: "new username created!", userId: newUser._id});

    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Server error/ Failed to create USER" });
    }
}

//POST (login) am user
const loginUser = async(req, res) => {
  try{
    const {username, password} = req.body;
    if(!username || !password) return res.status(400).json({error: "username/pwd not found"});

    const user = await UserData.findOne({username : username});
    if(!user) return res.status(400).json({error: "Username not found."});

    const decryptPass = await bcrypt.compare(password, user.password);
    if(!decryptPass) return res.status(404).json({error: "Sorry, the password you entered is incorrect."});
    
    const jwtTok  = jwt.sign(
          { userID: user._id, username: user.username },    //This is payload
          JWT_code,
          { expiresIn: "2h" }
    );

    res.cookie('token', jwtTok, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7200000,      //2h 
    });

    res.status(201).json({message: "user logged in!", userId: user._id});

  }catch(err){
    console.error(err);
    res.status(500).json({error: "Server error/ Failed to login USER"});
  }
}

//POST (logout) an user
const logoutUser = async(req, res) => {
  try{

    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), //Setting the date in the pats so that it is NOTEd as expired
    });

    res.status(200).json({ message: 'User logged out successfully' });

  }catch(err){
    console.log(err);
    res.status(500).json({error : "Server error/ Failed to logout USER"});
  }
}

//POST (Create) new event
const createNewEvent = async (req, res) => {
  try{
    
    const {userDate, event} = req.body;

    if(!userDate || !event) return res.status(400).json({error: "Params not found"});

    const user = req.user;    //from jwt verifyAuth
    if (!user)
      return res
        .status(400)
        .json({ error: "USER not found" });

    let newEvent;
    const userDay = user.days.find((d) => d.date === userDate);
    
    if(userDay){
      userDay.events.push(event);
      newEvent = userDay.events[userDay.events.length - 1];
    }else{
      const newDay = {
        date: userDate,
        events: [event],
      };
      user.days.push(newDay);
      newEvent = newDay.events[0];
    }

    await user.save();

    res.status(201).json(newEvent);

  }catch(err){
    console.log(err);
    res.status(500).json({error: "Server error / Failed to create the event"});
  }
}

//GET all events of the day for the user
const getAllUserEvents = async (req, res) => {
  try {
    
    const { date } = req.query; //e.g. /get-event?userID=alice&date=Day%201&activityName=Yoga
    if (!date) {
      console.log("date not found");
      return res.status(400).json({ error: "date found" });
    }
    
    const user = await req.user;    //from jwt verifyAuth
    if (!user)
      return res
        .status(400)
        .json({ error: "USER not found" });

    const userDay = user.days.find((d) => d.date === date);
    if (!userDay) return res.status(400).json({ error: "date not found" });

    const acts = userDay.events;
    if (acts.length === 0){
      return res.status(200).json([]);
    }

    return res.status(200).json(acts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

//GET a particular event of the day of the user
const getUserEvent = async (req, res) => {
  try {
    
    const { date } = req.query;
    const {id: eventID} = req.params;

    if (!eventID || !date) {
      console.log("date or eventID not found");
      return res.status(404).json({ error: "No date/eventID found" });
    }
    const user = req.user;
    if (!user)
      return res
        .status(404)
        .json({ error: "USER not found" });

    const userDay = user.days.find((d) => d.date === date);
    if (!userDay) return res.status(400).json({ error: "date not found" });

    const act = userDay.events.find((e) => e._id.toString() === eventID);
    if (!act)
      return res
        .status(400)
        .json({ error: "event not found for the given name of event" });

    return res.status(200).json(act);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

//DELETE an event 
const delEvent = async (req, res) => {
  try{
    const { id : eventID } = req.params;
    const { date } = req.query;

    const user = req.user;
    if(!user) return res.status(404).json({error: "User not found!"});

    const userDay = user.days.find((d) => d.date === date);
    if(!userDay) return res.status(404).json({error: "Date not found"});

    const index = userDay.events.findIndex((e) => e._id.toString() === eventID);    //here, index is the array index {not mongodb index}
    if(index === -1) return res.status(404).json({error: "eventID not found"});

    userDay.events.splice(index, 1);
    await user.save();

    res.status(200).json({message: "Event deleted successfully"});

  }catch(err){
    console.log(err);
    res.status(500).json({error: "Server error / Failed to delete event"});
  }
}

//DELETE an user
const delUser = async(req, res) => {
  try{
    
    const {password} = req.body;

    const user = req.user;
    if(!user) return res.status(404).json({error: "user not found!"});

    const decryptPass = await bcrypt.compare(password, user.password);
    if(!decryptPass) return res.status(404).json({error: "password is incorrect!"});
    
    const result = await UserData.deleteOne({_id : req.user._id});

    if(result.deletedCount === 0){
      return res.status(500).json({ error: "Failed to delete user." });
    }

    res.status(200).json({message: "user deleted successfully!"});

  }catch(err){
    console.log(err);
    res.status(500).json({error: "Server error / Failed to delete user"});
  }
}

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  createNewEvent,
  getAllUserEvents,
  getUserEvent,
  delEvent,
  delUser
}

