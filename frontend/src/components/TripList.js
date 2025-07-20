import {useContext} from 'react'
import TripContext from "../context/TripContext";
import {useState, useRef} from 'react';
import './TripList.css'

const LOCATIONIQ_TOKEN = process.env.REACT_APP_LOCATION_IQ_KEY;


const TripList = () => {

    const {trips, addTrip, deleteTrip} = useContext(TripContext);

    // eslint-disable-next-line
    const [currentTime, setCurrentTime] = useState(new Date());

    const [tripTitle, setTripTitle] = useState('');
    const [tripStartTime, setTripStartTime] = useState("00:00");
    const [tripEndTime, setTripEndTime] = useState("00:00");
    const [location, setLocation] = useState('');
    const [coords, setCoords] = useState(null);

    //For AutoCompletion of the address given by the user
    let debounceTimer = useRef(null);        //STOP excess requests per render

    const [suggestions, setSuggestions] = useState([]);

    const handleLocation = async (e) => {

        clearTimeout(debounceTimer);

        const value = e.target.value;
        setLocation(value);

        if(value.trim() === ""){
            setSuggestions([]);
            return;
        }

        if(value.length < 3){
            return;
        }

        if(debounceTimer.current){
            clearTimeout(debounceTimer.current);
        }

        //THIS THROWS TOO MANY REQ ERRORS THAT WILL BE THERE FOR THIS API (SO REMEMBER TO DEAL W THIS IN BACKEND)

        debounceTimer = setTimeout(async () => {
            const url = `https://api.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_TOKEN}&q=${encodeURIComponent(value)}&limit=5`;

            try{
                const res = await fetch(url);

                if(!res.ok){
                    console.error('LocationIQ error: '+ res.status + "status text:" + res.statusText);
                    return;
                }

                const data = await res.json();
                setSuggestions(data);
            } catch (err){
                console.err("Autocomplete error: " , err);
                setSuggestions([]);
            }
        }, 300);

        
    }

    const selectLocation = (place) => {
        setLocation(place.display_name);
        setSuggestions([]);
        setCoords({
            lat: place.lat,
            lon: place.lon
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const addTripSubmit = (e) => {
        e.preventDefault();

        if(!tripTitle || !tripStartTime || !tripEndTime || !location){
            alert("Fill in all the fields!");
            return;
        }

        const tripData = {
            title : tripTitle, 
            startTime: tripStartTime, 
            endTime: tripEndTime, 
            address: location,
            coordLat: coords.lat,
            coordLong: coords.lon,
        };

        addTrip(tripData);

        setTripTitle("");
        setTripStartTime("00:00");
        setTripEndTime("00:00");
        setLocation("");
        setCoords("");
    }

    return (
      <div className="container">
        <h1 className="heading">{formatDate(currentTime)}</h1>
        <p className="status-message">
          {trips.length === 0
            ? "No events found."
            : "The events for the day are:"}
        </p>

        <ul className="trip-list">
          {trips.map((trip) => (
            <li key={trip.id} className="trip-item">
              <div className="trip-info">
                <div className="trip-title">{trip.title}</div>
                <div className="trip-meta">
                  {trip.address}
                  <br />
                  {trip.startTime} - {trip.endTime}
                </div>
              </div>
              <button
                className="delete-btn"
                onClick={() => deleteTrip(trip.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <h2 className="subheading">Add an Event</h2>
        <form className="trip-form" onSubmit={addTripSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={tripTitle}
              placeholder="e.g., COMP 1010 Lecture"
              onChange={(e) => setTripTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Start Time:</label>
            <input
              type="time"
              value={tripStartTime}
              onChange={(e) => setTripStartTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>End Time:</label>
            <input
              type="time"
              value={tripEndTime}
              onChange={(e) => setTripEndTime(e.target.value)}
            />
          </div>
          <div className="form-group location-group">
            <label>Location:</label>
            <input
              type="text"
              value={location}
              placeholder="Type the location..."
              onChange={handleLocation}
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-box">
                {suggestions.map((place) => (
                  <li
                    key={place.place_id}
                    onClick={() => selectLocation(place)}
                  >
                    {place.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="add-btn" type="submit">
            Add
          </button>
        </form>
      </div>
    );

}

export default TripList;