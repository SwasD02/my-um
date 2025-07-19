import {useContext} from 'react'
import TripContext from "../context/TripContext";
import {useState, useRef} from 'react';

const LOCATIONIQ_TOKEN = process.env.REACT_APP_LOCATION_IQ_KEY;


const TripList = () => {

    const {trips, addTrip, deleteTrip} = useContext(TripContext);

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


    if(trips.length === 0){
        return(
            <p>No events found!</p>
        )
    }

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
        <div>
            <h1>List of events:</h1>
            {trips.length === 0 ? "No events found." : "The events for the day are: "}
            <ul>
                {trips.map((trip) => (
                    <li key={trip.id}>
                        <strong>{trip.title}</strong> at {trip.address}, from {trip.startTime} till {trip.endTime} with lat : {trip.coordLat} and long: {trip.coordLong}
                        <button onClick={() => deleteTrip(trip.id)}>
                            DEL
                        </button>
                    </li> 
                )
                )}
            </ul>
            

            <h2> ADD AN EVENT: </h2>
            <form onSubmit={addTripSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={tripTitle} placeholder="Class : COMP 1010" onChange= {(e) => setTripTitle(e.target.value)}/>
                </div>
                <div>
                    <label>Start Time:</label>
                    <input type="time" value={tripStartTime} onChange= {(e) => setTripStartTime(e.target.value)}/>
                </div>
                <div>
                    <label>End time:</label>
                    <input type="time" value={tripEndTime} onChange= {(e) => setTripEndTime(e.target.value)}/>
                </div>
                <div>
                    <label>Location:</label>
                    <input type="text" value={location} placeholder="Type the location..." onChange= {handleLocation}/>
                    {suggestions.length > 0 && (
                        <ul>
                            {suggestions.map((place) => {
                                return(
                                    <li key = {place.place_id}
                                    onClick={() => selectLocation(place)}>{place.display_name}</li>
                                );
                            })}
                        </ul>
                    )}
                </div>
                <button type="submit">ADD</button>
            </form>
        </div>
    )

}

export default TripList;