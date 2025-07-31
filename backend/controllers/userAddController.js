const UserData = require("../models/userData");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

//JWT code
const JWT_code = process.env.JWT_SECRET;
const SALT = 10;

//POST (Create) an user
const createUser = async(req, res) => {
    try{
        const {username, password} = req.body;
        if(!username || !password) return res.status(400).json({error: "username/pwd not found"});

        const user = await UserData.findOne({username : username});
        if(user) return res.status(409).json({message: "Sorry, user already exists!"});

        const hashedPwd = await bcrypt.hash(password, SALT);

        const newUser = await UserData.create({username : username, password: hashedPwd});
        if(!newUser) return res.status(400).json({error: "User creation failed!"});

        const jwtTok  = jwt.sign(
          { userId: newUser._id, username: newUser.username },
          JWT_code,
          { expiresIn: "2h" }
        );
        
        res.status(200).json({message: "new username created!", jwtTok, userId: newUser._id});

    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Server error/ Failed to create USER" });
    }
}

//POST (Create) new event
const createNewEvent = async (req, res) => {
  try{
    const {username, date, event} = req.body;

    if(!username || !date || !event) return res.status(400).json({error: "Params not found"});

    const user = await UserData.findOne({username: username});
    if (!user)
      return res
        .status(400)
        .json({ error: "userName may be incorrect: USER not found" });

    let newEvent;
    const userDay = user.days.find((d) => d.date === date);
    
    if(userDay){
      userDay.events.push(event);
      newEvent = userDay.events[userDay.events.length - 1];
    }else{
      const newDay = {
        date,
        events: [event],
      };
      user.days.push(newDay);
      newEvent = userDay.events[0];
    }

    await user.save();

    res.status(200).json(newEvent);

  }catch(err){
    console.log(err);
    res.status(400).json({error: "Server error / Failed to create the event"});
  }
}

//GET all events of the day for the user
const getAllUserEvents = async (req, res) => {
  try {
    const { username, date } = req.query; //e.g. /get-event?username=alice&date=Day%201&activityName=Yoga
    if (!username || !date) {
      console.log("username or date not found");
      return res.status(400).json({ error: "No username/date found" });
    }
    const user = await UserData.findOne({username: username});
    if (!user)
      return res
        .status(400)
        .json({ error: "userName may be incorrect: USER not found" });

    const userDay = user.days.find((d) => d.date === date);
    if (!userDay) return res.status(400).json({ error: "date not found" });

    const acts = userDay.events;
    if (acts.length === 0){
      return res.status(400).json({error: "No events found for the day"});
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
    const { username, date, eventID } = req.body;

    if (!username || !date) {
      console.log("username or date not found");
      return res.status(400).json({ error: "No username/date found" });
    }
    const user = await UserData.findOne({username: username});
    if (!user)
      return res
        .status(400)
        .json({ error: "userName may be incorrect: USER not found" });

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
    const {username, date, eventID} = req.body;

    const user = await UserData.findOne({username: username});
    if(!user) return res.status(400).json({error: "User not found!"});

    const userDay = user.days.find((d) => d.date === date);
    if(!userDay) return res.status(400).json({error: "Date not found"});

    const index = userDay.events.findIndex((e) => e._id.toString() === eventID);
    if(index === -1) return res.status(400).json({error: "eventID not found"})


    userDay.events.splice(index, 1);
    await user.save();

    res.status(200).json({message: "Event deleted successfully"});

  }catch(err){
    console.log(err);
    res.status(400).json(err);
  }
}

//DELETE an user
const delUser = async(req, res) => {
  try{
    const {username, password} = req.body;

    const user = await UserData.findOne({username: username});
    if(!user) return res.status(400).json({error: "user not found!"});

    const decryptPass = await bcrypt.compare(password, user.password);
    if(!decryptPass) return res.status(400).json({error: "password is incorrect!"});
    
    const result = await UserData.deleteOne({username: username});

    if(result.deletedCount === 0){
      return res.status(500).json({ error: "Failed to delete user." });
    }

    res.status(200).json({message: "user deleted succesfully!"});

  }catch(err){
    console.log(err);
    res.status(400).json(err);
  }
}

